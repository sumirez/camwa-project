import Lecturer from '../models/Lecturer.model.js'; 

const lecturerService = {
  createLecturer: async (lecturerData) => {
    try {
      const newLecturer = await Lecturer.create(lecturerData);
      return newLecturer;
    } catch (error) {
      throw new Error('Error creating lecturer: ' + error.message);
    }
  },

  getAllLecturers: async () => {
    try {
      const lecturers = await Lecturer.findAll();
      return lecturers;
    } catch (error) {
      throw new Error('Error retrieving lecturers: ' + error.message);
    }
  },
  findLecturerById: async (lecturer_id) => {
    try {
      const lecturer = await Lecturer.findOne({ where: { lecturer_id } });
      if (!lecturer) {
        throw new Error('Lecturer not found');
      }
      return lecturer;
    } catch (error) {
      throw new Error('Error finding lecturer: ' + error.message);
    }
  },
  deleteLecturer: async (lecturer_id) => {
    try {
      const result = await Lecturer.destroy({ where: { lecturer_id } });
      if (result === 0) {
        throw new Error('Lecturer not found');
      }
      return { message: 'Lecturer deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting lecturer: ' + error.message);
    }
  },
  updateLecturer: async (lecturer_id, updatedData) => {
    try {
      const [updated] = await Lecturer.update(updatedData, {
        where: { lecturer_id },
      });
      if (updated === 0) {
        throw new Error('Lecturer not found or no changes made');
      }
      const updatedLecturer = await Lecturer.findOne({ where: { lecturer_id } });
      return updatedLecturer;
    } catch (error) {
      throw new Error('Error updating lecturer: ' + error.message);
    }
  },
  createMultipleLecturersFromExcel: async (filePath) => {
    try {
      const fs = await import('fs/promises');
      
      // Check if file exists before attempting to read
      try {
        await fs.access(filePath);
        console.log(`Excel file exists at: ${filePath}`);
      } catch (fileError) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const Excel = (await import('exceljs')).default;
      const workbook = new Excel.Workbook();
      
      console.log(`Attempting to read Excel file from: ${filePath}`);
      
      // Parse the Excel file
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];
      
      console.log(`Excel file loaded successfully with ${worksheet.rowCount} rows`);
      
      const results = {
        successful: [],
        failed: []
      };
      
      // Skip the header row and process each row
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const lecturerId = row.getCell(1).value?.toString();
        const name = row.getCell(3).value?.toString();  // Name is in column 3 in the CSV
        const programId = row.getCell(4).value?.toString(); // Program ID is in column 4 in the CSV
        
        // Skip empty rows
        if (!lecturerId || !name || !programId) continue;
        
        try {
          // Create lecturer record
          const lecturerData = {
            lecturer_id: lecturerId,
            name: name,
            program_id: programId
          };
          
          // Use the existing createLecturer method to create each lecturer record
          const newLecturer = await lecturerService.createLecturer(lecturerData);
          results.successful.push({
            lecturerId: newLecturer.lecturer_id,
            name: newLecturer.name,
            programId: newLecturer.program_id
          });
        } catch (error) {
          results.failed.push({
            lecturerId,
            name,
            programId,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error('Error creating lecturers from Excel file: ' + error.message);
    }
  }
};

export default lecturerService;

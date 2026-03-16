import Iam from '../models/Iam.model.js';
import ImageAsset from '../models/ImageAsset.model.js';
import bcrypt from 'bcrypt';


const accountService = {
  getAllUsers: async () => {
    try {
      const users = await Iam.findAll({
        attributes: ['iam_id', 'username', 'email', 'role']
      });

      return users.map(user => ({
        iamId: user.iam_id,
        username: user.username,
        email: user.email,
        role: user.role
      }));
    } catch (error) {
      throw new Error('Error retrieving users: ' + error.message);
    }
  },

  getUserById: async (iamId) => {
    try {
      const user = await Iam.findByPk(iamId, {
        attributes: ['iam_id', 'username', 'email', 'role']
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        iamId: user.iam_id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw new Error('Error retrieving user: ' + error.message);
    }
  },

  createUser: async (userData) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const newUser = await Iam.create({
        iam_id: userData.iamId,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      return {
        iamId: newUser.iam_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      };
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  },

  updateUser: async (iamId, userData) => {
    try {
      const updateData = {
        username: userData.username,
        email: userData.email,
        role: userData.role
      };

      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(userData.password, salt);
      }

      const [updated] = await Iam.update(updateData, {
        where: { iam_id: iamId }
      });

      if (!updated) {
        throw new Error('User not found');
      }

      return await accountService.getUserById(iamId);
    } catch (error) {
      throw new Error('Error updating user: ' + error.message);
    }
  },

  deleteUser: async (iamId) => {
    try {
      const deleted = await Iam.destroy({
        where: { iam_id: iamId }
      });

      if (!deleted) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  },

  changePassword: async (iamId, currentPassword, newPassword) => {
    try {
      // Find the user by ID
      const user = await Iam.findByPk(iamId);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Update the password
      await Iam.update(
        { password: hashedNewPassword },
        { where: { iam_id: iamId } }
      );

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new Error('Error changing password: ' + error.message);
    }
  },

  createStudentImageAsset: async (username) => {
    try {
      await ImageAsset.create({
        username: username,
        image_path: `image_assets/${username}.jpg`
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  createMultipleStudentsFromExcel: async (filePath) => {
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
        const studentId = row.getCell(1).value?.toString();
        const email = row.getCell(2).value?.toString();

        // Skip empty rows
        if (!studentId || !email) continue;

        try {
          // Create student user with the same ID as username and password
          const userData = {
            iamId: studentId,
            username: studentId,
            password: studentId,
            email: email,
            role: 'STUDENT'
          };

          // Use the existing createUser method to create each student
          const newUser = await accountService.createUser(userData);

          // Create corresponding image asset for the student
          const imageResult = await accountService.createStudentImageAsset(studentId);
          if (!imageResult.success) {
            console.warn(`Failed to create image asset for student ${studentId}: ${imageResult.error}`);
            // Don't fail the entire operation if image creation fails
            if (!results.imageCreationWarnings) {
              results.imageCreationWarnings = [];
            }
            results.imageCreationWarnings.push({
              studentId,
              error: imageResult.error
            });
          } else {
            console.log(`Image asset created for student: ${studentId}`);
          }

          results.successful.push({
            iamId: newUser.iamId,
            username: newUser.username,
            email: newUser.email,
            imageAssetCreated: !results.imageCreationWarnings?.some(w => w.studentId === studentId)
          });
        } catch (error) {
          results.failed.push({
            studentId,
            email,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error('Error creating users from Excel file: ' + error.message);
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
        const email = row.getCell(2).value?.toString();

        // Skip empty rows
        if (!lecturerId || !email) continue;

        try {
          // Create lecturer user with the same ID as username and password
          const userData = {
            iamId: lecturerId,
            username: lecturerId,
            password: lecturerId,
            email: email,
            role: 'LECTURER'
          };

          // Use the existing createUser method to create each lecturer
          const newUser = await accountService.createUser(userData);
          results.successful.push({
            iamId: newUser.iamId,
            username: newUser.username,
            email: newUser.email
          });
        } catch (error) {
          results.failed.push({
            lecturerId,
            email,
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

export default accountService;

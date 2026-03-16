import Module from '../models/Module.model.js';
import Lecturer from '../models/Lecturer.model.js';
import Student from '../models/Student.model.js';
import Attendance from '../models/Attendance.model.js';
import auditLogService from '../services/auditLogService.js';
import { sendMail } from '../common/nodemailer/send-mail.nodemailer.js';
import { s3, BUCKET_NAME, CDN_ENDPOINT, URL_EXPIRY_SECONDS } from '../config/digitalocean.config.js';

const moduleService = {
    // Create a new module (Admin only)
    createModule: async (moduleData, userId) => {
        const module = await Module.create(moduleData);
        await auditLogService.logAction(userId, 'createModule', module);
        return module;
    },    // View all modules (Admin/Faculty Assistant)
    viewModules: async () => {
        return await Module.findAll();
    },

    checkModuleExists: async (moduleName, lecturerId) => {
    try {
        const existingModule = await Module.findOne({
            where: {
                name: moduleName,
                lecturer_id: lecturerId
            }
        });
        
        return !!existingModule; // Returns true if module exists, false otherwise
    } catch (error) {
        console.error("Error checking module existence:", error);
        throw error;
        }    },

    
    // Update a module by module_id (Admin/Faculty Assistant)
    updateModule: async (moduleId, updatedData, userId) => {
        const [affectedCount] = await Module.update(updatedData, { where: { module_id: moduleId } });  // Update module in the database
        if (affectedCount === 0) {
            throw new Error('Module not found or no changes made');  // Handle case where module was not found or no changes were made
        }
        await auditLogService.logAction(userId, 'updateModule', { moduleId, updatedData });  // Log the update action with userId
        return await Module.findByPk(moduleId);  // Return the updated module object
    },

    // Delete a module by module_id (Admin only)
    deleteModule: async (moduleId, userId) => {
        const affectedRows = await Module.destroy({ where: { module_id: moduleId } });  // Delete module from the database
        if (affectedRows === 0) {
            throw new Error('Module not found');  // Handle case where module was not found
        }
        await auditLogService.logAction(userId, 'deleteModule', { moduleId });  // Log the deletion action with userId
        return { message: 'Module successfully deleted' };  // Return success message
    },

    // Create multiple modules from Excel file (Admin only)
    createMultipleModulesFromExcel: async (filePath, userId) => {
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
                const moduleId = row.getCell(1).value?.toString();
                const name = row.getCell(2).value?.toString();
                const lecturerId = row.getCell(3).value?.toString();
                const programId = row.getCell(4).value?.toString();
                const intake = row.getCell(5).value?.toString();
                const semesterId = row.getCell(6).value?.toString();
                
                // Skip empty rows or rows with missing required fields
                if (!moduleId || !name || !lecturerId || !programId || !intake || !semesterId) {
                    console.log(`Skipping row ${i} due to missing required fields`);
                    continue;
                }
                
                try {
                    // Check if module with same name and lecturer already exists
                    const moduleExists = await moduleService.checkModuleExists(name, lecturerId);
                    if (moduleExists) {
                        results.failed.push({
                            moduleId,
                            name,
                            lecturerId,
                            error: 'Module with this name and lecturer already exists'
                        });
                        continue;
                    }
                    
                    // Create module record
                    const moduleData = {
                        module_id: moduleId,
                        name: name,
                        lecturer_id: lecturerId,
                        program_id: programId,
                        intake: parseInt(intake),
                        semester_id: semesterId
                    };
                    
                    // Use the existing createModule method
                    const newModule = await moduleService.createModule(moduleData, userId);
                    
                    results.successful.push({
                        moduleId: newModule.module_id,
                        name: newModule.name,
                        lecturerId: newModule.lecturer_id,
                        programId: newModule.program_id,
                        intake: newModule.intake,
                        semesterId: newModule.semester_id
                    });
                } catch (error) {
                    console.error(`Error creating module at row ${i}:`, error);
                    results.failed.push({
                        moduleId,
                        name,
                        lecturerId,
                        error: error.message
                    });
                }
            }
            
            // Log the bulk creation action
            await auditLogService.logAction(
                userId, 
                'bulkCreateModules', 
                { 
                    successCount: results.successful.length, 
                    failCount: results.failed.length 
                }
            );
            
            return results;
        } catch (error) {
            console.error('Error creating modules from Excel file:', error);
            throw new Error('Error creating modules from Excel file: ' + error.message);
        }
    },

    // Delete multiple modules from Excel file (Admin only)
    deleteMultipleModulesFromExcel: async (filePath, userId) => {
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
                const name = row.getCell(1).value?.toString();
                const lecturerId = row.getCell(2).value?.toString();
                const programId = row.getCell(3).value?.toString();
                const intake = row.getCell(4).value?.toString();
                const semesterId = row.getCell(5).value?.toString();
                
                // Skip empty rows or rows with missing critical identifiers
                if (!name || !lecturerId) {
                    console.log(`Skipping row ${i} due to missing name or lecturer_id`);
                    continue;
                }
                
                try {
                    // Find modules that match the criteria
                    const whereClause = {
                        name: name,
                        lecturer_id: lecturerId
                    };
                    
                    // Add optional filters if provided
                    if (programId) whereClause.program_id = programId;
                    if (intake) whereClause.intake = parseInt(intake);
                    if (semesterId) whereClause.semester_id = semesterId;
                    
                    // Find modules to delete first (to include in results)
                    const modulesToDelete = await Module.findAll({ where: whereClause });
                    
                    if (modulesToDelete.length === 0) {
                        results.failed.push({
                            name,
                            lecturerId,
                            programId,
                            intake,
                            semesterId,
                            error: 'No matching modules found'
                        });
                        continue;
                    }
                    
                    // Delete the modules
                    const deleteCount = await Module.destroy({ where: whereClause });
                    
                    // Record successful deletions
                    modulesToDelete.forEach(module => {
                        results.successful.push({
                            moduleId: module.module_id,
                            name: module.name,
                            lecturerId: module.lecturer_id,
                            programId: module.program_id,
                            intake: module.intake,
                            semesterId: module.semester_id
                        });
                    });
                    
                    // Log each deletion
                    await auditLogService.logAction(userId, 'deleteModuleFromExcel', { 
                        criteria: whereClause, 
                        count: deleteCount 
                    });
                    
                } catch (error) {
                    console.error(`Error deleting module at row ${i}:`, error);
                    results.failed.push({
                        name,
                        lecturerId,
                        programId,
                        intake,
                        semesterId,
                        error: error.message
                    });
                }
            }
            
            // Log the bulk deletion action
            await auditLogService.logAction(
                userId, 
                'bulkDeleteModules', 
                { 
                    successCount: results.successful.length, 
                    failCount: results.failed.length 
                }
            );
            
            return results;
        } catch (error) {
            console.error('Error deleting modules from Excel file:', error);
            throw new Error('Error deleting modules from Excel file: ' + error.message);
        }
    },

    // Get camera path with temporary signed URL (Admin only)
    getCameraPath: async (moduleId, userId) => {
        try {
            // Find the module by ID
            const module = await Module.findByPk(moduleId);
            
            if (!module) {
                throw new Error('Module not found');
            }
            
            if (!module.camera_path) {
                throw new Error('No camera path configured for this module');
            }
            
            // Generate signed URL with configurable expiration (default 5 minutes)
            const params = {
                Bucket: BUCKET_NAME,
                Key: module.camera_path, // This should be the video filename like "1.mp4"
                Expires: URL_EXPIRY_SECONDS // Default 300 seconds (5 minutes)
            };
            
            const signedUrl = await new Promise((resolve, reject) => {
                s3.getSignedUrl('getObject', params, (error, url) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(url);
                    }
                });
            });
            
            // Log the action
            await auditLogService.logAction(userId, 'getCameraPath', { 
                moduleId, 
                cameraPath: module.camera_path 
            });
            
            return {
                moduleId: module.module_id,
                moduleName: module.name,
                cameraPath: module.camera_path,
                signedUrl: signedUrl,
                expiresIn: '1 minutes'
            };
        } catch (error) {
            console.error('Error getting camera path:', error);
            throw error;
        }
    },

    // Set camera path for a module (Admin only)
    setCameraPath: async (moduleId, cameraPath, userId) => {
        try {
            // Find the module by ID
            const module = await Module.findByPk(moduleId);
            
            if (!module) {
                throw new Error('Module not found');
            }
            
            // Update the camera path
            const [affectedCount] = await Module.update(
                { camera_path: cameraPath }, 
                { where: { module_id: moduleId } }
            );
            
            if (affectedCount === 0) {
                throw new Error('Failed to update camera path');
            }
            
            // Log the action
            await auditLogService.logAction(userId, 'setCameraPath', { 
                moduleId, 
                oldCameraPath: module.camera_path,
                newCameraPath: cameraPath 
            });
            
            // Return updated module info
            const updatedModule = await Module.findByPk(moduleId);
            return {
                moduleId: updatedModule.module_id,
                moduleName: updatedModule.name,
                cameraPath: updatedModule.camera_path,
                message: 'Camera path updated successfully'
            };
        } catch (error) {
            console.error('Error setting camera path:', error);
            throw error;
        }
    },
};

export default moduleService;
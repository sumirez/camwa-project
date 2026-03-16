import moduleService from '../../src/services/module.service.js';
import Module from '../../src/models/Module.model.js';
import auditLogService from '../../src/services/auditLogService.js';
import { s3 } from '../../src/config/digitalocean.config.js';

// Mock the dependencies
jest.mock('../../src/models/Module.model.js');
jest.mock('../../src/services/auditLogService.js');
jest.mock('../../src/config/digitalocean.config.js');

describe('Module Service - Camera Path', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCameraPath', () => {
        it('should return signed URL for valid module with camera path', async () => {
            // Mock data
            const mockModule = {
                module_id: 'TCS',
                name: 'Theory of Computer Science',
                camera_path: '1.mp4'
            };
            const userId = 'admin123';
            const mockSignedUrl = 'https://camwa-project.sgp1.digitaloceanspaces.com/1.mp4?signed=true';

            // Mock implementations
            Module.findByPk.mockResolvedValue(mockModule);
            auditLogService.logAction.mockResolvedValue(true);
            
            // Mock s3.getSignedUrl
            const mockGetSignedUrl = jest.fn((operation, params, callback) => {
                callback(null, mockSignedUrl);
            });
            s3.getSignedUrl = mockGetSignedUrl;

            // Execute
            const result = await moduleService.getCameraPath('TCS', userId);

            // Assertions
            expect(Module.findByPk).toHaveBeenCalledWith('TCS');
            expect(mockGetSignedUrl).toHaveBeenCalledWith(
                'getObject',
                {
                    Bucket: 'camwa-project',
                    Key: '1.mp4',
                    Expires: 300
                },
                expect.any(Function)
            );
            expect(auditLogService.logAction).toHaveBeenCalledWith(
                userId,
                'getCameraPath',
                { moduleId: 'TCS', cameraPath: '1.mp4' }
            );
            expect(result).toEqual({
                moduleId: 'TCS',
                moduleName: 'Theory of Computer Science',
                cameraPath: '1.mp4',
                signedUrl: mockSignedUrl,
                expiresIn: '1 minutes'
            });
        });

        it('should throw error when module not found', async () => {
            Module.findByPk.mockResolvedValue(null);

            await expect(moduleService.getCameraPath('NONEXISTENT', 'admin123'))
                .rejects.toThrow('Module not found');
        });

        it('should throw error when module has no camera path', async () => {
            const mockModule = {
                module_id: 'TCS',
                name: 'Theory of Computer Science',
                camera_path: null
            };
            Module.findByPk.mockResolvedValue(mockModule);

            await expect(moduleService.getCameraPath('TCS', 'admin123'))
                .rejects.toThrow('No camera path configured for this module');
        });

        it('should handle S3 signed URL errors', async () => {
            const mockModule = {
                module_id: 'TCS',
                name: 'Theory of Computer Science',
                camera_path: '1.mp4'
            };
            Module.findByPk.mockResolvedValue(mockModule);

            // Mock s3.getSignedUrl to return error
            const mockGetSignedUrl = jest.fn((operation, params, callback) => {
                callback(new Error('S3 Error'), null);
            });
            s3.getSignedUrl = mockGetSignedUrl;

            await expect(moduleService.getCameraPath('TCS', 'admin123'))
                .rejects.toThrow('S3 Error');
        });
    });

    describe('setCameraPath', () => {
        it('should successfully set camera path for valid module', async () => {
            // Mock data
            const mockModule = {
                module_id: 'TCS',
                name: 'Theory of Computer Science',
                camera_path: 'old-video.mp4'
            };
            const updatedModule = {
                module_id: 'TCS',
                name: 'Theory of Computer Science',
                camera_path: 'new-video.mp4'
            };
            const userId = 'admin123';
            const newCameraPath = 'new-video.mp4';

            // Mock implementations
            Module.findByPk
                .mockResolvedValueOnce(mockModule) // First call for validation
                .mockResolvedValueOnce(updatedModule); // Second call for return
            Module.update.mockResolvedValue([1]); // 1 row affected
            auditLogService.logAction.mockResolvedValue(true);

            // Execute
            const result = await moduleService.setCameraPath('TCS', newCameraPath, userId);

            // Assertions
            expect(Module.findByPk).toHaveBeenCalledWith('TCS');
            expect(Module.update).toHaveBeenCalledWith(
                { camera_path: newCameraPath },
                { where: { module_id: 'TCS' } }
            );
            expect(auditLogService.logAction).toHaveBeenCalledWith(
                userId,
                'setCameraPath',
                {
                    moduleId: 'TCS',
                    oldCameraPath: 'old-video.mp4',
                    newCameraPath: 'new-video.mp4'
                }
            );
            expect(result).toEqual({
                moduleId: 'TCS',
                moduleName: 'Theory of Computer Science',
                cameraPath: 'new-video.mp4',
                message: 'Camera path updated successfully'
            });
        });

        it('should throw error when module not found', async () => {
            Module.findByPk.mockResolvedValue(null);

            await expect(moduleService.setCameraPath('NONEXISTENT', 'video.mp4', 'admin123'))
                .rejects.toThrow('Module not found');
        });

        it('should throw error when update fails', async () => {
            const mockModule = {
                module_id: 'TCS',
                name: 'Theory of Computer Science',
                camera_path: 'old-video.mp4'
            };
            Module.findByPk.mockResolvedValue(mockModule);
            Module.update.mockResolvedValue([0]); // 0 rows affected

            await expect(moduleService.setCameraPath('TCS', 'new-video.mp4', 'admin123'))
                .rejects.toThrow('Failed to update camera path');
        });
    });
});

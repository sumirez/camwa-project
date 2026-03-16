# Camera Path API Documentation

## Overview
This API allows administrators to retrieve temporary signed URLs for accessing module camera videos stored in DigitalOcean Spaces.

## Configuration
The API is configured to work with DigitalOcean Spaces with the following settings:
- **Bucket**: camwa-project
- **Region**: Singapore (sgp1)
- **CDN Endpoint**: https://camwa-project.sgp1.cdn.digitaloceanspaces.com
- **Original Endpoint**: https://camwa-project.sgp1.digitaloceanspaces.com

## API Endpoints

### Get Module Camera Path
**GET** `/api/module/camera-path/:moduleId`

**Authorization**: Admin only

**Description**: Retrieves a temporary signed URL for viewing the camera video of a specific module.

**Parameters**:
- `moduleId` (string, required): The ID of the module

**Response**:
```json
{
  "status": "success",
  "code": 200,
  "message": "Camera path retrieved successfully",
  "data": {
    "moduleId": "TCS",
    "moduleName": "Theory of Computer Science", 
    "cameraPath": "1.mp4",
    "signedUrl": "https://camwa-project.sgp1.digitaloceanspaces.com/1.mp4?AWSAccessKeyId=...&Expires=...&Signature=...",
    "expiresIn": "1 minutes"
  }
}
```

### Set Module Camera Path
**PUT** `/api/module/camera-path/:moduleId`

**Authorization**: Admin only

**Description**: Sets or updates the camera path for a specific module.

**Parameters**:
- `moduleId` (string, required): The ID of the module

**Request Body**:
```json
{
  "cameraPath": "new-video.mp4"
}
```

**Response**:
```json
{
  "status": "success",
  "code": 200,
  "message": "Camera path set successfully",
  "data": {
    "moduleId": "TCS",
    "moduleName": "Theory of Computer Science",
    "cameraPath": "new-video.mp4",
    "message": "Camera path updated successfully"
  }
}
```

### List All Modules
**GET** `/api/module/view`

**Authorization**: Admin or Faculty Assistant

**Description**: Lists all modules to help identify module IDs for camera path requests.

## Usage Example

1. **Get list of modules** (to find module IDs):
   ```
   GET /api/module/view
   Authorization: Bearer {admin_token}
   ```

2. **Request camera path for a specific module**:
   ```
   GET /api/module/camera-path/TCS
   Authorization: Bearer {admin_token}
   ```

3. **Use the returned signed URL** to view the video (valid for 1 minutes).

## Security Features
- **Admin-only access**: Only users with admin role can access camera paths
- **Temporary URLs**: Signed URLs expire after 1 minutes for security
- **Audit logging**: All camera path requests are logged for security tracking

## Example Module Setup
For the example module "TCS" with camera path "1.mp4":
- The video file "1.mp4" should be uploaded to the DigitalOcean Spaces bucket
- The module record should have `camera_path` field set to "1.mp4"
- When requested, the API will generate a temporary signed URL for accessing this video

## Technical Notes
- Uses AWS SDK v2 for DigitalOcean Spaces integration
- Signed URLs are generated using AWS S3 `getSignedUrl` method
- The CDN endpoint can be used for better performance if needed
- All actions are logged using the audit log service

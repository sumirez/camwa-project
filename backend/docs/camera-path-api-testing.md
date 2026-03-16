# API Testing Examples

## Prerequisites
1. Make sure you have a valid admin JWT token
2. Ensure the backend server is running
3. Verify that the TCS module exists in the database with camera_path = "1.mp4"

## Test the API Endpoints

### 1. Get all modules (to see available modules)
```bash
curl -X GET "http://localhost:3000/api/module/view" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 2. Get camera path for TCS module
```bash
curl -X GET "http://localhost:3000/api/module/camera-path/TCS" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 3. Set camera path for a module
```bash
curl -X PUT "http://localhost:3000/api/module/camera-path/TCS" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cameraPath": "new-video.mp4"}'
```

## Expected Response for Camera Path
```json
{
  "status": "success",
  "code": 200,
  "message": "Camera path retrieved successfully",
  "data": {
    "moduleId": "TCS",
    "moduleName": "Theory of Computer Science",
    "cameraPath": "1.mp4",
    "signedUrl": "https://camwa-project.sgp1.digitaloceanspaces.com/1.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
    "expiresIn": "5 minutes"
  }
}
```

## Using Postman
1. **Method**: GET
2. **URL**: `http://localhost:3000/api/module/camera-path/TCS`
3. **Headers**: 
   - Key: `Authorization`
   - Value: `Bearer YOUR_ADMIN_JWT_TOKEN`

## Testing the Signed URL
Once you get the signed URL from the API response:
1. Copy the `signedUrl` from the response
2. Open it in a web browser or use it in a video player
3. The URL will be valid for 5 minutes

## Error Cases to Test

### Non-admin user accessing camera path:
```bash
curl -X GET "http://localhost:3000/api/module/camera-path/TCS" \
  -H "Authorization: Bearer NON_ADMIN_JWT_TOKEN"
```

**Expected Response**:
```json
{
  "status": "error",
  "code": 403,
  "message": "Access denied: Only administrators are allowed to access camera paths"
}
```

### Non-admin user trying to set camera path:
```bash
curl -X PUT "http://localhost:3000/api/module/camera-path/TCS" \
  -H "Authorization: Bearer NON_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cameraPath": "video.mp4"}'
```

**Expected Response**:
```json
{
  "status": "error",
  "code": 403,
  "message": "Access denied: Only administrators are allowed to set camera paths"
}
```

### Module not found:
```bash
curl -X GET "http://localhost:3000/api/module/camera-path/NONEXISTENT" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### Unauthorized access (no token):
```bash
curl -X GET "http://localhost:3000/api/module/camera-path/TCS"
```

## Notes
- Replace `YOUR_ADMIN_JWT_TOKEN` with an actual admin JWT token
- Replace `http://localhost:3000` with your actual server URL and port
- The signed URL expires after 5 minutes for security
- Only admin users can access the camera path API

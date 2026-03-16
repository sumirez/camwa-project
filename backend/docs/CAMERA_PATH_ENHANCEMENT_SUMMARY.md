# Camera Path API Enhancement Summary

## New Features Added

### 1. Enhanced Role-Based Access Control
- **Enhanced getCameraPath**: Added explicit role checking with custom error message
- **Custom Error Messages**: Specific messages for unauthorized access attempts

### 2. Set Camera Path API
- **New Endpoint**: `PUT /api/module/camera-path/:moduleId`
- **Admin Only**: Restricted to administrators only
- **Functionality**: Allows admins to set or update camera paths for modules

## Implementation Details

### API Endpoints

#### Get Camera Path (Enhanced)
- **Route**: `GET /api/module/camera-path/:moduleId`
- **Authorization**: Admin only
- **New Feature**: Explicit role checking with custom error message
- **Error Response for Non-Admin**:
  ```json
  {
    "status": "error",
    "code": 403,
    "message": "Access denied: Only administrators are allowed to access camera paths"
  }
  ```

#### Set Camera Path (New)
- **Route**: `PUT /api/module/camera-path/:moduleId`
- **Authorization**: Admin only
- **Request Body**:
  ```json
  {
    "cameraPath": "video-filename.mp4"
  }
  ```
- **Response**:
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

### Service Layer Changes

#### New Method: `setCameraPath`
```javascript
setCameraPath: async (moduleId, cameraPath, userId) => {
    // Validates module existence
    // Updates camera_path field
    // Logs the action with audit trail
    // Returns updated module information
}
```

#### Enhanced: `getCameraPath`
- No changes to functionality
- Works with enhanced controller role checking

### Controller Layer Changes

#### Enhanced: `getCameraPath`
- Added explicit role checking: `if (req.user.role !== 'ADMIN')`
- Custom error message for unauthorized access
- Still uses middleware for additional security

#### New: `setCameraPath`
- Admin-only access with explicit role checking
- Input validation for required `cameraPath` field
- Comprehensive error handling

### Database Operations

#### Set Camera Path
- Updates `camera_path` field in Module table
- Uses `Module.update()` with WHERE clause
- Validates affected row count
- Maintains data integrity

### Security Features

#### Dual Layer Protection
1. **Middleware Level**: `verifyTokenAndRole(['ADMIN'])`
2. **Controller Level**: Explicit role checking with custom messages

#### Audit Logging
- All camera path operations are logged
- Includes old and new values for updates
- Tracks user ID and timestamp

### Testing

#### Unit Tests Added
- **setCameraPath Success**: Valid module and camera path
- **setCameraPath Module Not Found**: Invalid module ID
- **setCameraPath Update Failure**: Database update failure
- Enhanced existing getCameraPath tests

#### Manual Testing Examples
```bash
# Set camera path (Admin only)
curl -X PUT "http://localhost:3000/api/module/camera-path/TCS" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cameraPath": "new-video.mp4"}'

# Test unauthorized access
curl -X PUT "http://localhost:3000/api/module/camera-path/TCS" \
  -H "Authorization: Bearer NON_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cameraPath": "video.mp4"}'
```

## Error Handling

### Role-Based Errors
- **403 Forbidden**: Custom messages for unauthorized role access
- **400 Bad Request**: Missing required fields
- **404 Not Found**: Module doesn't exist
- **500 Internal Server Error**: Database or system errors

### Validation
- **Module Existence**: Validates module exists before operations
- **Required Fields**: Validates cameraPath is provided
- **Update Success**: Verifies database update succeeded

## Files Modified/Created

### Modified Files
1. **`src/services/module.service.js`**: Added setCameraPath method
2. **`src/controllers/moduleManagement.controller.js`**: Added setCameraPath controller and enhanced getCameraPath
3. **`src/routes/module.router.js`**: Added PUT route for setCameraPath
4. **`tests/services/module.service.test.js`**: Added setCameraPath tests
5. **`docs/camera-path-api.md`**: Updated API documentation
6. **`docs/camera-path-api-testing.md`**: Added testing examples

## Usage Workflow

### Admin Setting Camera Path
1. Admin authenticates and gets JWT token
2. Admin calls `PUT /api/module/camera-path/:moduleId` with camera path
3. System validates admin role and module existence
4. Database updates camera_path field
5. Action is logged for audit trail
6. Success response returned

### Admin Getting Camera Path
1. Admin authenticates and gets JWT token
2. Admin calls `GET /api/module/camera-path/:moduleId`
3. System validates admin role and module existence
4. Signed URL generated with 1-minute expiry
5. Action is logged for audit trail
6. Temporary URL returned for video access

### Non-Admin Access Attempt
1. Non-admin user tries to access either endpoint
2. Middleware checks role authorization
3. Controller performs additional role validation
4. Custom error message returned explaining access restriction
5. Access attempt may be logged for security monitoring

## Security Considerations

- **Dual Authorization**: Both middleware and controller-level checks
- **Custom Error Messages**: Clear communication of access restrictions  
- **Audit Trail**: All operations logged with user identification
- **Input Validation**: Prevents invalid data injection
- **Temporary URLs**: 1-minute expiry for secure video access
- **Role Segregation**: Only administrators can manage camera paths

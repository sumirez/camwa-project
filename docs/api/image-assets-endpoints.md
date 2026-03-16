# Image Assets API Endpoints
**Version:** 1.4.0  
**Last Updated:** January 2025

## 📋 Overview
API endpoints for managing student profile images and image assets with database integration and direct file serving capabilities.

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🖼️ Image Management Endpoints

### Get Student Images
```http
GET /students/:student_id/images
```

**Description:** Get all images for a specific student.

**Access:** Admin, Faculty, Lecturer, Student (own images only)

**Parameters:**
- `student_id` (path) - Student ID

**Response:**
```json
{
    "status": "success",
    "message": "Student images retrieved successfully",
    "data": [
        {
            "image_id": 1,
            "username": "10421001",
            "image_path": "image_assets/10421001.jpg",
            "created_at": "2025-01-15T10:00:00.000Z",
            "updated_at": "2025-01-15T10:00:00.000Z"
        }
    ]
}
```

### Get My Images (Authenticated Student)
```http
GET /students/my/images
```

**Description:** Get all images for the authenticated student.

**Access:** Student only

**Response:** Same format as above

### Create Student Image
```http
POST /students/:student_id/images
```

**Description:** Create a new image asset record for a student.

**Access:** Admin, Faculty only

**Parameters:**
- `student_id` (path) - Student ID

**Request Body:**
```json
{
    "image_path": "image_assets/10421001_profile.jpg"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Student image created successfully",
    "data": {
        "image_id": 2,
        "username": "10421001",
        "image_path": "image_assets/10421001_profile.jpg",
        "created_at": "2025-01-15T10:30:00.000Z",
        "updated_at": "2025-01-15T10:30:00.000Z"
    }
}
```

### Get Specific Image File Info
```http
GET /students/:student_id/images/:image_id
```

**Description:** Get information about a specific image file.

**Access:** Admin, Faculty, Lecturer, Student (own images only)

**Parameters:**
- `student_id` (path) - Student ID
- `image_id` (path) - Image ID

**Response:**
```json
{
    "status": "success",
    "message": "Image file information retrieved successfully",
    "data": {
        "image_id": 1,
        "username": "10421001",
        "image_path": "image_assets/10421001.jpg",
        "file_exists": true,
        "file_size": 245760,
        "created_at": "2025-01-15T10:00:00.000Z"
    }
}
```

### Update Student Image
```http
PUT /students/:student_id/images/:image_id
```

**Description:** Update an existing image asset record.

**Access:** Admin, Faculty only

**Parameters:**
- `student_id` (path) - Student ID
- `image_id` (path) - Image ID

**Request Body:**
```json
{
    "image_path": "image_assets/10421001_updated.jpg"
}
```

### Delete Student Image
```http
DELETE /students/:student_id/images/:image_id
```

**Description:** Delete an image asset record.

**Access:** Admin, Faculty only

**Parameters:**
- `student_id` (path) - Student ID
- `image_id` (path) - Image ID

**Response:**
```json
{
    "status": "success",
    "message": "Student image deleted successfully"
}
```

## 📁 Direct File Access

### Get Image File
```http
GET /image_assets/:filename
```

**Description:** Direct access to image files without authentication.

**Access:** Public (no authentication required)

**Parameters:**
- `filename` (path) - Image filename (e.g., "10421001.jpg")

**Response:** Binary image data with appropriate content-type headers

**Example:**
```html
<img src="http://localhost:3000/image_assets/10421001.jpg" alt="Student Profile">
```

## 🔧 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📊 Data Models

### Image Asset
```typescript
interface ImageAsset {
    image_id: number;
    username: string;
    image_path: string;
    created_at: string;
    updated_at: string;
}
```

### Image File Info
```typescript
interface ImageFileInfo extends ImageAsset {
    file_exists: boolean;
    file_size?: number;
    mime_type?: string;
}
```

## 🎯 Usage Examples

### Upload and Register Image
```javascript
// 1. First, upload the physical file to /image_assets/ directory
// 2. Then create the database record

const response = await fetch('/api/students/10421001/images', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        image_path: 'image_assets/10421001_profile.jpg'
    })
});

const result = await response.json();
console.log('Image registered:', result.data);
```

### Display Student Image
```javascript
// Get student's images
const response = await fetch('/api/students/10421001/images', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const data = await response.json();
if (data.data.length > 0) {
    const imageUrl = `http://localhost:3000/${data.data[0].image_path}`;
    document.getElementById('profileImage').src = imageUrl;
}
```

### Check Image Existence
```javascript
// Verify image file exists
const response = await fetch('/api/students/10421001/images/1', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

const data = await response.json();
if (data.data.file_exists) {
    console.log('Image file exists and is accessible');
} else {
    console.log('Image file not found');
}
```

## 📁 File System Integration

### Directory Structure
```
image_assets/
├── 10421001.jpg          # Primary profile image
├── 10421001_alt.jpg      # Alternative image
├── 10421002.jpg          # Another student's image
└── ...
```

### File Naming Conventions
- **Primary Profile:** `{student_id}.jpg`
- **Alternative Images:** `{student_id}_{description}.jpg`
- **Temporary Images:** `{student_id}_temp_{timestamp}.jpg`

### Supported File Types
- **JPEG:** `.jpg`, `.jpeg`
- **PNG:** `.png`
- **GIF:** `.gif`
- **WebP:** `.webp`

## 🔒 Security Considerations

### Access Control
- **Database Records:** Role-based access control
- **File Access:** Public access for direct serving
- **Student Privacy:** Students can only access own images
- **Administrative Control:** Only Admin/Faculty can create/modify records

### File Security
- **Path Validation:** Prevent directory traversal attacks
- **File Size Limits:** Prevent large file uploads
- **File Type Validation:** Only allow image file types
- **Virus Scanning:** Recommended for production

### Best Practices
- **Secure File Upload:** Validate file types and sizes
- **Regular Cleanup:** Remove orphaned files
- **Backup Strategy:** Include image assets in backups
- **CDN Integration:** Consider CDN for production deployments

## 🚨 Error Handling

### Common Errors
- **404 Not Found:** Image record or file doesn't exist
- **403 Forbidden:** Insufficient permissions
- **400 Bad Request:** Invalid image path or file format
- **500 Internal Server Error:** Database or file system issues

### Error Response Format
```json
{
    "status": "error",
    "code": 404,
    "message": "Image not found",
    "error": "The requested image record does not exist"
}
```

## 📈 Performance Considerations

### Optimization
- **Caching:** Use HTTP caching headers for static files
- **Compression:** Optimize image sizes before storage
- **Lazy Loading:** Load images on demand
- **Batch Operations:** Process multiple images efficiently

### Monitoring
- **File Size Tracking:** Monitor storage usage
- **Access Patterns:** Track frequently accessed images
- **Error Rates:** Monitor failed image requests
- **Performance Metrics:** Track response times

---

**Related Documents:**
- [Image Assets System](../updates/2025-Q1-image-assets-system.md)
- [File Upload Configuration](../configuration/file-upload-config.md)
- [Database Schema](../database/image-assets-schema.md)

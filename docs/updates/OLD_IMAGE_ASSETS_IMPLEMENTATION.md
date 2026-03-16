# Image Assets Implementation Summary

## Overview
This implementation adds image asset management functionality to the student management system. Students can now have profile images that are stored and managed through the database with file serving capabilities.

## Files Created/Modified

### 1. Migration File
- **File**: `backend/migrations/15-create-image.cjs`
- **Purpose**: Creates the `image_assets` table in the database
- **Table Structure**:
  - `image_id` (Primary Key, Auto Increment)
  - `username` (Foreign Key to `iam.username`)
  - `image_path` (Path to the image file)
  - `created_at`, `updated_at` (Timestamps)

### 2. Model File
- **File**: `backend/src/models/ImageAsset.model.js`
- **Purpose**: Sequelize model for image assets
- **Features**:
  - Automatic path generation using hooks
  - Relationships with Iam model
  - Proper validation and constraints

### 3. Service Methods Added
- **File**: `backend/src/services/student.service.js`
- **New Methods**:
  - `getStudentImages(studentId)`: Get all images for a student
  - `createStudentImage(studentId, imagePath)`: Create new image record
  - `getStudentImageFile(studentId, imageId)`: Get specific image file info

### 4. Controller Methods Added
- **File**: `backend/src/controllers/student.controller.js`
- **New Methods**:
  - `getStudentImages`: Get images for any student (ADMIN/FACULTY/LECTURER/STUDENT access)
  - `getMyImages`: Get images for authenticated student (STUDENT access)
  - `createStudentImage`: Create new image asset (ADMIN/FACULTY access)
  - `getStudentImageFile`: Get specific image file info

### 5. Routes Added
- **File**: `backend/src/routes/student.router.js`
- **New Endpoints**:
  - `GET /api/students/:student_id/images` - Get all images for a student
  - `GET /api/students/my/images` - Get my images (authenticated student)
  - `POST /api/students/:student_id/images` - Create new image asset
  - `GET /api/students/:student_id/images/:image_id` - Get specific image file info

### 6. Database Relationships
- **File**: `backend/src/models/index.model.js`
- **Updated**: Added ImageAsset model import and Iam-ImageAsset relationships

### 7. Static File Serving
- **File**: `backend/server.js`
- **Added**: Express static middleware to serve image files from `/image_assets` directory

### 8. Seeder File
- **File**: `backend/seeders/15-image-assets-seeder.cjs`
- **Purpose**: Seeds sample image data (currently includes 10421001.jpg)

## API Endpoints

### Get Student Images
```
GET /api/students/:student_id/images
Authorization: ADMIN, FACULTY, LECTURER, STUDENT
Response: List of all images for the specified student
```

### Get My Images (Authenticated Student)
```
GET /api/students/my/images
Authorization: STUDENT
Response: List of all images for the authenticated student
```

### Create Student Image
```
POST /api/students/:student_id/images
Authorization: ADMIN, FACULTY
Body: { "image_path": "image_assets/student_id.jpg" }
Response: Created image asset information
```

### Get Specific Image File Info
```
GET /api/students/:student_id/images/:image_id
Authorization: ADMIN, FACULTY, LECTURER, STUDENT
Response: Image file path and metadata
```

### Static Image Access
```
GET /image_assets/filename.jpg
No authorization required
Response: Actual image file
```

## How to Use

### 1. Run Migration
```bash
npm run migrate
```

### 2. Run Seeder (Optional)
```bash
npm run seed
```

### 3. Access Images
- **API**: Use the endpoints above to manage image records
- **Direct File Access**: Access images directly via `http://localhost:3000/image_assets/10421001.jpg`

### 4. Add New Images
1. Place image files in the `image_assets` directory
2. Use the POST endpoint to create database records
3. Images will be accessible via both API and direct URL

## Database Schema

```sql
CREATE TABLE image_assets (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(45) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES iam(username) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_username (username)
);
```

## Example Usage

### Get Student Images
```javascript
// GET /api/students/10421001/images
{
  "status": "success",
  "message": "Student images retrieved successfully",
  "data": {
    "message": "Found 1 image(s) for this student",
    "student_id": "10421001",
    "images": [
      {
        "image_id": 1,
        "username": "10421001",
        "image_path": "image_assets/10421001.jpg",
        "created_at": "2025-06-27T...",
        "updated_at": "2025-06-27T...",
        "user_info": {
          "email": "student@example.com",
          "role": "STUDENT"
        }
      }
    ]
  }
}
```

### Create Student Image
```javascript
// POST /api/students/10421001/images
// Body: { "image_path": "image_assets/10421001_profile.jpg" }
{
  "status": "success",
  "message": "Student image created successfully",
  "data": {
    "message": "Image asset created successfully",
    "image": {
      "image_id": 2,
      "username": "10421001",
      "image_path": "image_assets/10421001_profile.jpg",
      "created_at": "2025-06-27T..."
    }
  }
}
```

## Notes

- Image files should be placed in the root `image_assets` directory
- The system supports multiple images per student
- Default image path format: `image_assets/{username}.jpg`
- Images are served statically and can be accessed directly via URL
- All endpoints include proper authorization checks
- The system maintains referential integrity with the IAM table

# Image Assets Management System
**Update Date:** 2025-Q1  
**Version:** 1.4.0  
**Status:** ✅ Completed

## 🎯 Overview
Implemented a comprehensive image asset management system enabling students to have profile images with database-backed storage and direct file serving capabilities.

## 🚀 Key Features Added

### 1. **Database Schema**
- New `image_assets` table with proper relationships
- Foreign key integration with IAM system
- Automatic timestamp tracking

### 2. **File Management**
- Static file serving from `/image_assets` directory
- Support for multiple images per student
- Automatic path generation with hooks

### 3. **API Endpoints**
- `GET /api/students/:student_id/images` - Get all student images
- `GET /api/students/my/images` - Get authenticated student's images
- `POST /api/students/:student_id/images` - Create new image asset
- `GET /api/students/:student_id/images/:image_id` - Get specific image info
- `GET /image_assets/:filename` - Direct file access

## 📋 Technical Implementation

### Database Schema
```sql
CREATE TABLE image_assets (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    FOREIGN KEY (username) REFERENCES iam(username)
);
```

### Backend Implementation
- **New Files:**
  - `migrations/15-create-image.cjs` - Database migration
  - `src/models/ImageAsset.model.js` - Sequelize model
  - `seeders/15-image-assets-seeder.cjs` - Sample data seeder

- **Modified Files:**
  - `src/services/student.service.js` - Added image management methods
  - `src/controllers/student.controller.js` - Added image endpoints
  - `src/routes/student.router.js` - Added image routes
  - `src/models/index.model.js` - Added model relationships
  - `server.js` - Added static file serving

### Service Methods
```javascript
// New service methods added
getStudentImages(studentId)
createStudentImage(studentId, imagePath)
getStudentImageFile(studentId, imageId)
```

## 🔒 Security & Access Control
- **Admin/Faculty:** Full access to all student images
- **Lecturers:** View access to student images
- **Students:** Full access to own images only
- **Public:** Direct file access via static serving

## 📊 Storage Architecture
- **Physical Storage:** `/image_assets/` directory
- **Database Records:** Metadata and path information
- **Naming Convention:** `{username}.jpg` or custom names
- **File Types:** JPG, PNG, GIF supported

## 🎯 Usage Examples

### Adding Student Images
```bash
# 1. Place file in image_assets directory
# 2. Create database record via API
POST /api/students/10421001/images
{
    "image_path": "image_assets/10421001_profile.jpg"
}
```

### Accessing Images
```bash
# Via API
GET /api/students/10421001/images

# Direct file access
GET /image_assets/10421001.jpg
```

## 🔧 Setup Instructions
1. Run migration: `npm run migrate`
2. Run seeder: `npm run seed`
3. Place image files in `/image_assets/` directory
4. Create database records via API

## 📁 File Structure
```
image_assets/
├── 10421001.jpg
├── 10421002.jpg
└── 10421003.jpg
```

## 🎯 Benefits
1. **Centralized Storage:** Single location for all student images
2. **Database Integration:** Proper metadata management
3. **Direct Access:** Fast file serving without API overhead
4. **Scalable:** Support for multiple images per student
5. **Secure:** Role-based access control

---
**Related Documents:**
- [API Documentation](../api/image-assets-endpoints.md)
- [Database Schema](../database/image-assets-schema.md)

# CAMWA – Class Attendance Management Web Application

[![Version](https://img.shields.io/badge/version-1.6.0-blue.svg)](docs/CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)](README.md)

## 🎯 Overview
CAMWA is a comprehensive web-based system designed for efficiently managing class attendance. It allows lecturers to track attendance, students to view their attendance records, and admins to manage modules, programs, and users seamlessly. The system utilizes:

- **Frontend**: Angular-based single-page application (SPA)
- **Backend**: Node.js with Express and PostgreSQL
- **Authentication**: Firebase Authentication with JWT for secure access control
- **Features**: Real-time attendance tracking, exam eligibility management, email notifications, and comprehensive analytics

## 📋 Table of Contents
- [🚀 What's New](#-whats-new)
- [🔧 Project Setup](#-project-setup)
- [▶️ Running the Application](#️-running-the-application)
- [📁 Project Structure](#-project-structure)
- [📊 Key Features](#-key-features)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 What's New

### Latest Updates (Version 1.6.0)
- **📊 [Exam Eligibility Management](docs/updates/2025-Q1-exam-eligibility-system.md)** - Automated exam eligibility calculations with 80% attendance threshold
- **📈 [Attendance Rate Analytics](docs/updates/2025-Q1-attendance-rate-feature.md)** - Real-time attendance rate calculations and module performance insights
- **🖼️ [Image Assets System](docs/updates/2025-Q1-image-assets-system.md)** - Student profile image management with database integration
- **📧 [Enhanced Email Service](docs/configuration/email-service-config.md)** - Gmail SMTP integration with automated notifications

### 🔗 Quick Links
- **[📋 Complete Changelog](docs/CHANGELOG.md)** - Detailed version history
- **[🔧 Configuration Guides](docs/configuration/)** - Setup and configuration documentation
- **[📊 Update Documentation](docs/updates/)** - Feature implementation details

## 🔧 Project Setup

### Prerequisites
Before starting, ensure you have the following installed:

- **Node.js & npm**: [Download from Node.js](https://nodejs.org)
- **Angular CLI**: Install globally:
  ```bash
  npm install -g @angular/cli
  ```
- **Git**: [Download from Git](https://git-scm.com)
- **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)

### Backend Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/lcnguyencs/camwa-project.git
   cd camwa-project/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure PostgreSQL using pgAdmin4**:
   -During installation of postgreSQL, make sure to also install pgAdmin4.
   - Open pgAdmin4 and choose a master password. "1234" is used in this project.
   - Connect to the Postgres server with:
     - Host: `127.0.0.1`
     - Port: `5432`
     - User: `postgres`
     - Password: `1234`
   - Create a new database with the name "camwa_db"

4. **Create `.env` file in the backend directory**:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=1234
   DB_NAME=camwa_db
   JWT_SECRET=mysecretkey
   GOOGLE_APPLICATION_CREDENTIALS=./backend/src/config/serviceAccountKey.json
   ```

5. **Create/Edit `config.json` file in `backend/config` directory**:
   ```env
   {
      "development": {
         "username": "postgres",
         "password": "1234",
         "database": "camwa_db",
         "host": "localhost",
         "port": 5432,
         "dialect": "postgres"
      },
      "test": {
         "username": "postgres",
         "password": "1234",
         "database": "camwa_db",
         "host": "localhost",
         "port": 5432,
         "dialect": "postgres"
      },
      "production": {
         "username": "postgres",
         "password": "1234",  
         "database": "camwa_db",
         "host": "localhost",
         "port": 5432,
         "dialect": "postgres"
      }
   }
   ```

6. **Getting serviceAccountKey.json**:
   - Go to "https://console.firebase.google.com/u/0/project/vgu-attendance-management/settings/serviceaccounts/adminsdk"
   - Generate new private key
   - Rename the downloaded file to `serviceAccountKey.json`and save it in `backend/src/config/`

7. **Sequalize the database**:
   ```bash
   npm run database:migrate 
   ```
   ```bash
   npm run database:seed
   ```

8. **Start the backend server**:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`.

### Frontend Setup
1. **Navigate to the frontend folder**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `environment.ts` in `src/environments/`**:
   ```typescript
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: "<your-firebase-api-key>",
       authDomain: "<your-auth-domain>.firebaseapp.com",
       projectId: "<your-project-id>",
       storageBucket: "<your-storage-bucket>.appspot.com",
       messagingSenderId: "<your-messaging-sender-id>",
       appId: "<your-app-id>"
     },
     apiUrl: 'http://localhost:3000'
   };
   ```
   You can get these values from Project Settings -> General -> Your apps -> Firebase SDK snippet.

4. **Run the frontend server**:
   ```bash
   ng serve
   ```
   The frontend will be available at `http://localhost:4200`.

## Running the Application
1. **Run the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Run the frontend server**:
   ```bash
   cd frontend
   ng serve
   ```

3. **Access the application**:
   - **Frontend**: [http://localhost:4200](http://localhost:4200)
   - **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)

## 📁 Project Structure
```
camwa-project/
│
├── backend/                      # Backend (Node.js + Express + PostgreSQL)
│   ├── src/                      # Source code for backend
│   │   ├── controllers/          # Controllers for API logic
│   │   ├── models/               # Sequelize models for database tables
│   │   ├── routes/               # Express routes
│   │   ├── middleware/           # Middleware for authentication, validation
│   │   └── config/               # Database and Firebase configuration
│   ├── .env                      # Environment variables
│   └── server.js                 # Server setup and launch
│
├── frontend/                     # Frontend (Angular)
│   ├── src/                      # Angular source code
│   │   ├── app/                  # Components, services, and modules
│   │   ├── environments/         # Environment configurations
│   │   └── index.html            # Root HTML template
│
├── docs/                         # Documentation
│   ├── updates/                  # Feature update documentation
│   ├── configuration/            # Configuration guides
│   ├── api/                      # API documentation
│   └── CHANGELOG.md              # Version history
│
├── image_assets/                 # Student profile images
└── docker-compose.yml            # Docker configuration
```

## 📊 Key Features

### 🎯 Core Functionality
- **Attendance Tracking**: Real-time attendance management with multiple status options
- **User Management**: Role-based access control (Admin, Faculty, Lecturer, Student)
- **Module Management**: Comprehensive course and program organization
- **Exam Eligibility**: Automated eligibility calculations based on attendance rates

### 🚀 Advanced Features
- **📈 Analytics Dashboard**: Real-time attendance rate calculations and performance insights
- **🖼️ Image Assets**: Student profile image management with database integration
- **📧 Email Notifications**: Automated email notifications for attendance corrections and updates
- **📊 Bulk Operations**: System-wide exam eligibility updates and bulk data management

### 🔒 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Granular permission system
- **Data Isolation**: Lecturer-specific data access controls
- **Audit Trails**: Comprehensive logging and tracking

## 📚 API Documentation

### 🌐 Interactive API Documentation
- **Swagger UI**: [http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/)
- **Postman Collection**: Available in `/docs/api/` folder

### 📋 Key API Endpoints
- **Authentication**: `/api/auth/*` - User authentication and authorization
- **Attendance**: `/api/attendance/*` - Attendance tracking and management
- **Students**: `/api/students/*` - Student management and profile data
- **Modules**: `/api/modules/*` - Module and course management
- **Exam Eligibility**: `/api/attendance/exam-eligibility/*` - Automated eligibility calculations
- **Image Assets**: `/api/students/*/images/*` - Profile image management

### 🚀 Quick Start
1. **Backend**: `cd backend && npm start`
2. **Frontend**: `cd frontend && ng serve`
3. **Access**: [http://localhost:4200](http://localhost:4200)

### 📧 Email Configuration
For email notifications, set up Gmail SMTP:
```bash
# Add to backend/.env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```
📖 **Setup Guide**: [Gmail Configuration](docs/configuration/gmail-setup.md)

## 🤝 Contributing
We welcome contributions from the community! Please follow these steps to contribute:

### 🔧 Development Workflow
1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine:
   ```bash
   git clone <your-fork-url>
   ```
3. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "Add your commit message here"
   ```
5. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a pull request** on the main repository

### 📚 Development Resources
- **[Documentation](docs/)** - Comprehensive guides and references
- **[Update History](docs/updates/)** - Recent feature implementations
- **[Configuration Guides](docs/configuration/)** - Setup and configuration help
- **[API Documentation](docs/api/)** - Endpoint specifications

### 🐛 Reporting Issues
- **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- **Feature Requests**: Submit via GitHub Issues with clear requirements
- **Security Issues**: Report privately to maintainers

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 🎯 Quick Navigation

### 📋 Documentation
- **[📊 Changelog](docs/CHANGELOG.md)** - Version history and updates
- **[🔧 Configuration](docs/configuration/)** - Setup and configuration guides
- **[📈 Updates](docs/updates/)** - Recent feature implementations

### 🚀 Key Features
- **[Attendance Rate Analytics](docs/updates/2025-Q1-attendance-rate-feature.md)** - Real-time performance insights
- **[Exam Eligibility Management](docs/updates/2025-Q1-exam-eligibility-system.md)** - Automated eligibility calculations
- **[Image Assets System](docs/updates/2025-Q1-image-assets-system.md)** - Profile image management
- **[Email Service](docs/configuration/email-service-config.md)** - Automated notifications

### 🔗 Quick Links
- **[Live Demo](https://www.youtube.com/watch?v=SPuSc05JIlM)** - Access the application
- **[API Documentation](http://localhost:3000/api-docs/#/)** - Interactive API docs
- **[GitHub Repository](https://github.com/lcnguyencs/camwa-project)** - Source code

---

**🏫 CAMWA - Class Attendance Management Web Application**  
**Version 1.6.0** | **© 2025 CAMWA Development Team**


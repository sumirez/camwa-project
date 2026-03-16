# Attendance Configuration Guide
**Version:** 1.5.0  
**Last Updated:** February 2025

## 📋 Overview
Configuration guide for attendance rate calculations, monitoring, and performance optimization in the CAMWA system.

## 🔧 Configuration Files

### Environment Variables
```bash
# Attendance Rate Configuration
ATTENDANCE_RATE_CACHE_TTL=300          # Cache TTL in seconds (5 minutes)
ATTENDANCE_RATE_BATCH_SIZE=100         # Batch size for bulk calculations
ATTENDANCE_RATE_TIMEOUT=30000          # Query timeout in milliseconds
ENABLE_ATTENDANCE_RATE_CACHE=true      # Enable caching for rate calculations

# Performance Settings
MAX_ATTENDANCE_RECORDS_PER_QUERY=1000  # Limit records per query
ATTENDANCE_CALCULATION_RETRY_ATTEMPTS=3 # Retry attempts for failed calculations
```

### Database Configuration
```sql
-- Indexes for performance optimization
CREATE INDEX idx_attendance_module_id ON attendance(module_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_module_student ON attendance(module_id, student_id);
```

## 📊 Attendance Rate Calculation Settings

### Status Definitions
Configure which attendance statuses count towards eligibility:

```javascript
// In attendance.service.js
const ELIGIBLE_STATUSES = ['present', 'late', 'excused'];
const INELIGIBLE_STATUSES = ['absent'];

// Configurable threshold (can be environment variable)
const ATTENDANCE_THRESHOLD = process.env.ATTENDANCE_THRESHOLD || 80.0;
```

### Calculation Parameters
```javascript
// Attendance rate calculation configuration
const ATTENDANCE_CONFIG = {
    // Minimum records required for calculation
    MIN_RECORDS_FOR_CALCULATION: 1,
    
    // Decimal places for rate display
    RATE_DECIMAL_PLACES: 2,
    
    // Cache configuration
    CACHE_ENABLED: process.env.ENABLE_ATTENDANCE_RATE_CACHE === 'true',
    CACHE_TTL: parseInt(process.env.ATTENDANCE_RATE_CACHE_TTL) || 300,
    
    // Batch processing
    BATCH_SIZE: parseInt(process.env.ATTENDANCE_RATE_BATCH_SIZE) || 100,
    
    // Query timeout
    QUERY_TIMEOUT: parseInt(process.env.ATTENDANCE_RATE_TIMEOUT) || 30000
};
```

## 🚀 Performance Optimization

### Caching Strategy
```javascript
// Redis cache configuration for attendance rates
const CACHE_CONFIG = {
    // Cache keys pattern
    ATTENDANCE_RATE_KEY: 'attendance_rate:module:{module_id}',
    MODULE_RATES_KEY: 'module_rates:lecturer:{lecturer_id}',
    
    // Cache TTL settings
    SHORT_TTL: 300,    // 5 minutes
    MEDIUM_TTL: 1800,  // 30 minutes
    LONG_TTL: 3600,    // 1 hour
    
    // Cache invalidation triggers
    INVALIDATE_ON_ATTENDANCE_UPDATE: true,
    INVALIDATE_ON_STUDENT_REGISTRATION: true
};
```

### Database Query Optimization
```sql
-- Optimized query for attendance rate calculation
SELECT 
    module_id,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status IN ('present', 'late', 'excused') THEN 1 END) as non_absent_records,
    ROUND(
        (COUNT(CASE WHEN status IN ('present', 'late', 'excused') THEN 1 END) * 100.0 / COUNT(*)), 
        2
    ) as attendance_rate
FROM attendance 
WHERE module_id = ? 
GROUP BY module_id;
```

### Bulk Processing Configuration
```javascript
// Bulk processing settings
const BULK_PROCESSING_CONFIG = {
    // Maximum modules to process simultaneously
    MAX_CONCURRENT_MODULES: 5,
    
    // Delay between module processing (milliseconds)
    PROCESSING_DELAY: 100,
    
    // Batch size for student records
    STUDENT_BATCH_SIZE: 50,
    
    // Error handling
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
};
```

## 📈 Monitoring and Logging

### Logging Configuration
```javascript
// Logging levels for attendance operations
const LOGGING_CONFIG = {
    // Log levels
    ATTENDANCE_RATE_CALCULATION: 'info',
    BULK_OPERATIONS: 'debug',
    ERROR_HANDLING: 'error',
    PERFORMANCE_METRICS: 'warn',
    
    // Log formats
    LOG_FORMAT: 'combined',
    LOG_FILE_PATH: './logs/attendance.log',
    
    // Performance logging
    LOG_SLOW_QUERIES: true,
    SLOW_QUERY_THRESHOLD: 5000 // milliseconds
};
```

### Metrics Collection
```javascript
// Metrics to track
const METRICS_CONFIG = {
    // Performance metrics
    CALCULATION_TIME: true,
    CACHE_HIT_RATE: true,
    QUERY_EXECUTION_TIME: true,
    
    // Business metrics
    ATTENDANCE_RATE_DISTRIBUTION: true,
    MODULE_PERFORMANCE: true,
    STUDENT_ENGAGEMENT: true,
    
    // Error metrics
    CALCULATION_ERRORS: true,
    TIMEOUT_ERRORS: true,
    DATABASE_ERRORS: true
};
```

## 🔒 Security Configuration

### Access Control
```javascript
// Role-based access configuration
const ACCESS_CONTROL_CONFIG = {
    // Lecturer access
    LECTURER_MODULE_ACCESS: {
        CAN_VIEW_OWN_MODULES: true,
        CAN_VIEW_OTHER_MODULES: false,
        CAN_VIEW_SYSTEM_WIDE: false
    },
    
    // Admin/Faculty access
    ADMIN_FACULTY_ACCESS: {
        CAN_VIEW_ALL_MODULES: true,
        CAN_VIEW_SYSTEM_WIDE: true,
        CAN_ACCESS_BULK_OPERATIONS: true
    },
    
    // Student access
    STUDENT_ACCESS: {
        CAN_VIEW_OWN_ATTENDANCE: true,
        CAN_VIEW_OWN_RATES: true,
        CAN_VIEW_MODULE_RATES: false
    }
};
```

### Data Privacy
```javascript
// Data privacy settings
const PRIVACY_CONFIG = {
    // Data anonymization
    ANONYMIZE_STUDENT_DATA: false,
    HIDE_INDIVIDUAL_RATES: false,
    
    // Data retention
    ATTENDANCE_DATA_RETENTION_DAYS: 1095, // 3 years
    RATE_CALCULATION_LOG_RETENTION_DAYS: 365, // 1 year
    
    // Audit logging
    LOG_ACCESS_ATTEMPTS: true,
    LOG_DATA_EXPORTS: true
};
```

## 🔧 System Integration

### API Rate Limiting
```javascript
// Rate limiting for attendance endpoints
const RATE_LIMIT_CONFIG = {
    // General endpoints
    ATTENDANCE_RATE_ENDPOINTS: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many attendance rate requests'
    },
    
    // Bulk operations
    BULK_OPERATION_ENDPOINTS: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // limit bulk operations
        message: 'Too many bulk operation requests'
    }
};
```

### Database Connection Settings
```javascript
// Database configuration for attendance operations
const DB_CONFIG = {
    // Connection pool settings
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000
    },
    
    // Query settings
    dialectOptions: {
        connectTimeout: 30000,
        acquireTimeout: 30000,
        timeout: 30000
    },
    
    // Logging
    logging: process.env.NODE_ENV === 'development' ? console.log : false
};
```

## 🎯 Default Configuration

### Production Settings
```bash
# Production environment variables
NODE_ENV=production
ATTENDANCE_RATE_CACHE_TTL=600
ATTENDANCE_RATE_BATCH_SIZE=200
ATTENDANCE_RATE_TIMEOUT=45000
ENABLE_ATTENDANCE_RATE_CACHE=true
MAX_ATTENDANCE_RECORDS_PER_QUERY=2000
ATTENDANCE_CALCULATION_RETRY_ATTEMPTS=5
```

### Development Settings
```bash
# Development environment variables
NODE_ENV=development
ATTENDANCE_RATE_CACHE_TTL=60
ATTENDANCE_RATE_BATCH_SIZE=50
ATTENDANCE_RATE_TIMEOUT=15000
ENABLE_ATTENDANCE_RATE_CACHE=false
MAX_ATTENDANCE_RECORDS_PER_QUERY=500
ATTENDANCE_CALCULATION_RETRY_ATTEMPTS=2
```

### Test Settings
```bash
# Test environment variables
NODE_ENV=test
ATTENDANCE_RATE_CACHE_TTL=0
ATTENDANCE_RATE_BATCH_SIZE=10
ATTENDANCE_RATE_TIMEOUT=5000
ENABLE_ATTENDANCE_RATE_CACHE=false
MAX_ATTENDANCE_RECORDS_PER_QUERY=100
ATTENDANCE_CALCULATION_RETRY_ATTEMPTS=1
```

## 📊 Configuration Validation

### Environment Validation
```javascript
// Validate configuration on startup
const validateConfig = () => {
    const requiredEnvVars = [
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    // Validate numeric values
    const numericVars = {
        ATTENDANCE_RATE_CACHE_TTL: parseInt(process.env.ATTENDANCE_RATE_CACHE_TTL) || 300,
        ATTENDANCE_RATE_BATCH_SIZE: parseInt(process.env.ATTENDANCE_RATE_BATCH_SIZE) || 100,
        ATTENDANCE_RATE_TIMEOUT: parseInt(process.env.ATTENDANCE_RATE_TIMEOUT) || 30000
    };
    
    Object.entries(numericVars).forEach(([key, value]) => {
        if (isNaN(value) || value <= 0) {
            throw new Error(`Invalid numeric value for ${key}: ${value}`);
        }
    });
};
```

## 🔄 Configuration Updates

### Hot Reload Configuration
```javascript
// Watch for configuration changes
const watchConfig = () => {
    if (process.env.NODE_ENV === 'development') {
        // Watch for .env file changes
        fs.watchFile('.env', () => {
            console.log('Configuration file changed, reloading...');
            require('dotenv').config();
        });
    }
};
```

### Configuration Management
```javascript
// Centralized configuration management
class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
        this.validateConfig();
    }
    
    loadConfig() {
        return {
            attendance: {
                cacheEnabled: process.env.ENABLE_ATTENDANCE_RATE_CACHE === 'true',
                cacheTTL: parseInt(process.env.ATTENDANCE_RATE_CACHE_TTL) || 300,
                batchSize: parseInt(process.env.ATTENDANCE_RATE_BATCH_SIZE) || 100,
                queryTimeout: parseInt(process.env.ATTENDANCE_RATE_TIMEOUT) || 30000
            },
            performance: {
                maxRecordsPerQuery: parseInt(process.env.MAX_ATTENDANCE_RECORDS_PER_QUERY) || 1000,
                retryAttempts: parseInt(process.env.ATTENDANCE_CALCULATION_RETRY_ATTEMPTS) || 3
            }
        };
    }
    
    validateConfig() {
        // Validation logic here
    }
    
    get(path) {
        return this.getNestedValue(this.config, path);
    }
    
    getNestedValue(obj, path) {
        return path.split('.').reduce((o, p) => o && o[p], obj);
    }
}
```

---

**Related Documents:**
- [Attendance Rate Feature](../updates/2025-Q1-attendance-rate-feature.md)
- [API Documentation](../api/attendance-endpoints.md)
- [Performance Tuning Guide](performance-tuning.md)

import express from 'express';
import { loginUser, refreshToken, logOutUser, logOutFromAllDevices, getBlacklistStats, toggleACRole } from '../controllers/authController.js';
import { authenticateJWT, verifyTokenAndRole, getUserRole } from '../middleware/authMiddleware.js';

const authRoutes = express.Router();

// Public routes
// Public routes
authRoutes.post('/login', loginUser);
authRoutes.post('/refresh-token', refreshToken);

// Protected routes - require authentication
authRoutes.post('/logout', authenticateJWT, logOutUser);
authRoutes.post('/logout-all-devices', authenticateJWT, logOutFromAllDevices);
authRoutes.post('/toggle-ac-role', authenticateJWT, toggleACRole);

// Debug/monitoring routes (consider restricting to admin only in production)
authRoutes.get('/blacklist-stats', verifyTokenAndRole(['ADMIN']), getBlacklistStats);

// Test route to verify token and get role
authRoutes.get('/verify-role', getUserRole);

// Role-based dashboard routes
authRoutes.get('/ADMIN-dashboard', verifyTokenAndRole(['ADMIN']), (req, res) => {
    res.json({ message: 'Welcome to the ADMIN dashboard' });
});

authRoutes.get('/faculty-dashboard', verifyTokenAndRole(['FACULTY']), (req, res) => {
    res.json({ message: 'Welcome to the faculty dashboard' });
});

authRoutes.get('/lecturer-dashboard', verifyTokenAndRole(['LECTURER']), (req, res) => {
    res.json({ message: 'Welcome to the lecturer dashboard' });
});

authRoutes.get('/student-dashboard', verifyTokenAndRole(['STUDENT']), (req, res) => {
    res.json({ message: 'Welcome to the student dashboard' });
});

export default authRoutes;

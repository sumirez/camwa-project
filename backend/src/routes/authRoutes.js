import express from 'express';
import { loginUser, refreshToken, logOutUser } from '../controllers/authController.js';
import { authenticateJWT, verifyTokenAndRole } from '../middleware/authMiddleware.js';

const authRoutes = express.Router();

// Public routes
authRoutes.post('/login', loginUser);
authRoutes.post('/refresh-token', refreshToken);

// Protected routes - require authentication
authRoutes.post('/logout', authenticateJWT, logOutUser);

// Role-based dashboard routes
authRoutes.get('/ADMIN-dashboard', verifyTokenAndRole(['ADMIN']), (req, res) => {
    res.json({ message: 'Welcome to the ADMIN dashboard' });
});

authRoutes.get('/faculty-dashboard', verifyTokenAndRole(['faculty']), (req, res) => {
    res.json({ message: 'Welcome to the faculty dashboard' });
});

authRoutes.get('/lecturer-dashboard', verifyTokenAndRole(['lecturer']), (req, res) => {
    res.json({ message: 'Welcome to the lecturer dashboard' });
});

authRoutes.get('/student-dashboard', verifyTokenAndRole(['student']), (req, res) => {
    res.json({ message: 'Welcome to the student dashboard' });
});

export default authRoutes;

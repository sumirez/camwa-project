import jwt from 'jsonwebtoken';
import tokenBlacklistService from '../services/tokenBlacklist.service.js';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is blacklisted
    if (tokenBlacklistService.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been invalidated' });
    }

    // Check if user has been logged out from all devices
    if (tokenBlacklistService.isUserTokenInvalidated(decoded.uid, decoded.iat * 1000)) {
      return res.status(401).json({ message: 'Session has been invalidated' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyTokenAndRole = (requiredRoles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Check if token is blacklisted
      if (tokenBlacklistService.isTokenBlacklisted(token)) {
        return res.status(401).json({ message: 'Token has been invalidated' });
      }

      // Check if user has been logged out from all devices
      if (tokenBlacklistService.isUserTokenInvalidated(decoded.uid, decoded.iat * 1000)) {
        return res.status(401).json({ message: 'Session has been invalidated' });
      }

      req.user = decoded;

      if (requiredRoles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

export const getUserRole = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is blacklisted
    if (tokenBlacklistService.isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been invalidated' });
    }

    // Check if user has been logged out from all devices
    if (tokenBlacklistService.isUserTokenInvalidated(decoded.uid, decoded.iat * 1000)) {
      return res.status(401).json({ message: 'Session has been invalidated' });
    }

    req.user = decoded;

    // Return the role information for testing
    return res.status(200).json({
      success: true,
      role: decoded.role,
      userId: decoded.userId,
      message: 'Token decoded successfully'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

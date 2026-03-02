import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
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

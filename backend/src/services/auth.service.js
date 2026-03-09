import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Iam from '../models/Iam.model.js';
import { UnauthorizedError, NotFoundError } from '../common/helpers/error.helper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';

const authService = {
  login: async (credentials) => {
    const { email, password } = credentials;

    const user = await Iam.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { uid: user.acc_id, 
        email: user.email, 
        role: user.role, 
        username: user.username},
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { uid: user.acc_id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in database
    await user.update({ refresh_token: refreshToken });

    return {
      userId: user.acc_id,
      accessToken,
      refreshToken,
      role: user.role,
      username: user.username
    };
  },

  refreshAccessToken: async (refreshToken) => {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    const user = await Iam.findOne({ where: { refresh_token: refreshToken } });
    if (!user) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      
      const accessToken = jwt.sign(
        { uid: user.acc_id, 
          email: user.email, 
          role: user.role, 
          username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { accessToken };
    } catch (error) {
      await user.update({ refresh_token: null });
      throw new UnauthorizedError('Invalid refresh token');
    }
  },

  logOut: async (userId) => {
    const user = await Iam.findOne({ where: { acc_id: userId } });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await user.update({ refresh_token: null });
    return { message: 'Logged out successfully' };
  },

  register: async (userData) => {
    const { username, email, password, role } = userData;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Iam.create({
      acc_id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    return {
      acc_id: newUser.acc_id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };
  }
};

export default authService;

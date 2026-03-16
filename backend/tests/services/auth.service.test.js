import authService from '../../src/services/auth.service.js';
import { verifyRefreshToken, generateTokens } from '../../src/config/jwtConfig.js';
import admin from '../../src/config/firebaseConfig.js';
import bcrypt from 'bcryptjs';
import Iam from '../../src/models/Iam.model.js';
import { sendMail } from '../../src/common/nodemailer/send-mail.nodemailer.js';
import { UnauthorizedError, NotFoundError } from '../../src/common/helpers/error.helper.js';

// Mocking external services
jest.mock('../../src/config/jwtConfig.js');
jest.mock('../../src/config/firebaseConfig.js');
jest.mock('bcryptjs');
jest.mock('../../src/models/Iam.model.js');
jest.mock('../../src/common/nodemailer/send-mail.nodemailer.js');

describe('authService.refreshAccessToken', () => {
  it('should generate new access and refresh tokens', async () => {
    const refreshToken = 'valid_refresh_token';
    const decoded = { uid: '123', email: 'john@example.com', role: 'student' };
    verifyRefreshToken.mockReturnValue(decoded);
    generateTokens.mockReturnValue({
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    });

    const result = await authService.refreshAccessToken(refreshToken);

    expect(result.accessToken).toBe('new_access_token');
    expect(result.refreshToken).toBe('new_refresh_token');
  });

  it('should throw error if refresh token is invalid', async () => {
    const refreshToken = 'invalid_refresh_token';
    verifyRefreshToken.mockImplementation(() => { throw new Error('Invalid token'); });

    await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrowError('Invalid token');
  });
});

describe('authService.logOut', () => {
  it('should successfully log out the user', async () => {
    const uid = '123';
    admin.auth().revokeRefreshTokens.mockResolvedValue();

    const result = await authService.logOut(uid);

    expect(result.message).toBe('User logged out successfully');
    expect(admin.auth().revokeRefreshTokens).toHaveBeenCalledWith(uid);
  });

  it('should throw an error if logout fails', async () => {
    const uid = '123';
    admin.auth().revokeRefreshTokens.mockRejectedValue(new Error('Failed to revoke token'));

    await expect(authService.logOut(uid)).rejects.toThrowError('Logout failed: Unable to revoke tokens');
  });
});

describe('authService.login', () => {
  it('should successfully login and return access and refresh tokens', async () => {
    const req = {
      body: {
        idToken: 'firebase_id_token',
        password: 'password123',
      },
    };

    const decodedToken = { uid: '123', email: 'john@example.com' };
    const user = { iam_Id: '123', password: 'hashed_password', role: 'student' };

    admin.auth().verifyIdToken.mockResolvedValue(decodedToken);
    Iam.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    generateTokens.mockReturnValue({
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    });

    const result = await authService.login(req);

    expect(result.accessToken).toBe('new_access_token');
    expect(result.refreshToken).toBe('new_refresh_token');
  });

  it('should throw an error if password does not match', async () => {
    const req = { body: { idToken: 'firebase_id_token', password: 'wrong_password' } };
    const decodedToken = { uid: '123', email: 'john@example.com' };
    const user = { iam_Id: '123', password: 'hashed_password', role: 'student' };

    admin.auth().verifyIdToken.mockResolvedValue(decodedToken);
    Iam.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.login(req)).rejects.toThrowError(UnauthorizedError);
  });

  it('should throw error if user not found', async () => {
    const req = { body: { idToken: 'firebase_id_token', password: 'password123' } };
    const decodedToken = { uid: '123', email: 'john@example.com' };

    admin.auth().verifyIdToken.mockResolvedValue(decodedToken);
    Iam.findOne.mockResolvedValue(null);

    await expect(authService.login(req)).rejects.toThrowError(NotFoundError);
  });
});

describe('authService.register', () => {
  it('should register a new user and hash the password', async () => {
    const userData = {
      iam_Id: '123',
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'student',
    };

    bcrypt.hash.mockResolvedValue('hashed_password');
    Iam.create.mockResolvedValue(userData);

    const result = await authService.register(userData);

    expect(result.email).toBe('john@example.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(Iam.create).toHaveBeenCalledWith({
      ...userData,
      password: 'hashed_password',
    });
    expect(sendMail).toHaveBeenCalledWith({
      to: 'john@example.com',
      subject: 'Welcome to Our Platform',
      text: expect.stringContaining('Hello john_doe'),
      html: expect.stringContaining('Hello john_doe'),
    });
  });
});
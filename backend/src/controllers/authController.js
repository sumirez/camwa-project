import authService from '../services/auth.service.js';
import { responseError, responseSuccess } from '../common/helpers/response.helper.js';

export const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    const resData = responseSuccess(result, 'Login successful');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Login failed');
    return res.status(resData.code).json(resData);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    const resData = responseSuccess(result, 'Token refreshed successfully');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Token refresh failed');
    return res.status(resData.code).json(resData);
  }
};

export const logOutUser = async (req, res) => {
  try {
    // Extract access token from Authorization header
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      const resData = responseError(
        { message: 'Access token missing' },
        'Logout failed'
      );
      return res.status(401).json(resData);
    }

    const result = await authService.logOut(accessToken);
    const resData = responseSuccess(result, 'Logout successful');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Logout failed');
    return res.status(resData.code).json(resData);
  }
};

export const logOutFromAllDevices = async (req, res) => {
  try {
    // Extract access token from Authorization header
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      const resData = responseError(
        { message: 'Access token missing' },
        'Logout from all devices failed'
      );
      return res.status(401).json(resData);
    }

    const result = await authService.logOutFromAllDevices(accessToken);
    const resData = responseSuccess(result, 'Logged out from all devices successfully');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Logout from all devices failed');
    return res.status(resData.code).json(resData);
  }
};

export const getBlacklistStats = async (req, res) => {
  try {
    const stats = authService.getBlacklistStats();
    const resData = responseSuccess(stats, 'Blacklist stats retrieved successfully');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Failed to get blacklist stats');
    return res.status(resData.code).json(resData);
  }
};

export const toggleACRole = async (req, res) => {
  try {
    // Extract access token from Authorization header
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      const resData = responseError(
        { message: 'Access token missing' },
        'Role toggle failed'
      );
      return res.status(401).json(resData);
    }

    const result = await authService.toggleACRole(accessToken);
    const resData = responseSuccess(result, 'Role toggled successfully');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Role toggle failed');
    return res.status(resData.code).json(resData);
  }
};

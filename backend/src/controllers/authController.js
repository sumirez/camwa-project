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
    const result = await authService.logOut(req.body.userId);
    const resData = responseSuccess(result, 'Logout successful');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Logout failed');
    return res.status(resData.code).json(resData);
  }
};

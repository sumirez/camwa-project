import dashboardService from '../services/dashboard.service.js';
import { responseError, responseSuccess } from '../common/helpers/response.helper.js';

export const getDashboardStats = async (req, res) => {
  try {
    const result = await dashboardService.getDashboardStats();
    const resData = responseSuccess(result, 'Dashboard statistics retrieved successfully');
    return res.status(200).json(resData);
  } catch (error) {
    const resData = responseError(error, 'Failed to retrieve dashboard statistics');
    return res.status(resData.code || 500).json(resData);
  }
};

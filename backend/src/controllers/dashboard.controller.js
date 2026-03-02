import dashboardService from '../services/dashboard.service.js';
import { responseSuccess } from '../common/helpers/response.helper.js';

const dashboardController = {
  getAttendanceAnalytics: async (req, res, next) => {
    const result = await dashboardService.getAttendanceAnalytics();
    const resData = responseSuccess(result, 'Attendance analytics retrieved successfully');
    res.status(resData.code).json(resData);
  },
};

export default dashboardController;


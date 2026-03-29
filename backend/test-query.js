import dashboardService from './src/services/dashboard.service.js';

async function test() {
  try {
    const res = await dashboardService.getAttendanceAnalytics();
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error executing query:', err);
  }
  process.exit();
}

test();

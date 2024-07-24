const axios = require('axios');

const API_URL = 'http://10.44.17.45:5000';

const sendAttendanceData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/attendance`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending attendance data:', error);
    throw error;
  }
};

module.exports = {
  sendAttendanceData
};

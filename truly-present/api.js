// api.js
import axios from 'axios';

const API_URL = 'http://192.168.160.121:5000';

export const sendAttendanceData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/attendance`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending attendance data:', error);
    throw error;
  }
};

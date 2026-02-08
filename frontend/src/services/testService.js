import api from './api';

export const testConnection = async () => {
  try {
    const response = await api.get('/weatherforecast');
    console.log('✅ Backend connected successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return { success: false, error: error.message };
  }
};
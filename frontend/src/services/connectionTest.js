import api from './api';

export const connectionTest = {
  // Test backend connection
  testConnection: async () => {
    try {
      const response = await api.get('/test');
      return { success: true, message: 'Backend connected successfully', data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: 'Backend connection failed', 
        error: error.response?.data || error.message 
      };
    }
  },

  // Test authentication endpoints
  testAuthEndpoints: async () => {
    const endpoints = [
      '/auth/register',
      '/auth/register-ngo', 
      '/auth/register-admin',
      '/auth/login',
      '/auth/login-ngo'
    ];
    
    const results = {};
    for (const endpoint of endpoints) {
      try {
        await api.options(endpoint);
        results[endpoint] = 'Available';
      } catch (error) {
        results[endpoint] = error.response?.status === 405 ? 'Available' : 'Not Available';
      }
    }
    return results;
  }
};
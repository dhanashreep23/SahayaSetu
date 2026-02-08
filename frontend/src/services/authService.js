import api from './api';

export const authService = {
  // Donor Registration
  registerDonor: async (donorData) => {
    const response = await api.post('/auth/register', donorData);
    return response.data;
  },

  // Admin Registration
  registerAdmin: async (adminData) => {
    const response = await api.post('/auth/register-admin', adminData);
    return response.data;
  },

  // Login (Donor/Admin)
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

// NGO Registration
registerNGO: async (ngoData) => {
  const response = await api.post('/auth/register-ngo', ngoData);
  return response.data;
},

// NGO Login
loginNGO: async (credentials) => {
  const response = await api.post('/auth/login-ngo', credentials);
  return response.data;
}

};
import api from './api';

export const adminService = {
  // Get all NGOs
  getAllNGOs: async () => {
    const response = await api.get('/admin/ngos');
    return response.data;
  },

  // Get all donors
  getAllDonors: async () => {
    const response = await api.get('/admin/donors');
    return response.data;
  },

  // Approve NGO
  approveNGO: async (ngoId) => {
    const response = await api.put(`/admin/ngos/${ngoId}/approve`);
    return response.data;
  },

  // Disapprove NGO
  disapproveNGO: async (ngoId) => {
    const response = await api.put(`/admin/ngos/${ngoId}/disapprove`);
    return response.data;
  },

  // Disable NGO
  disableNGO: async (ngoId) => {
    const response = await api.put(`/admin/ngos/${ngoId}/disable`);
    return response.data;
  },

  // Re-enable NGO
  enableNGO: async (ngoId) => {
    const response = await api.put(`/admin/ngos/${ngoId}/enable`);
    return response.data;
  },

  // Get all requests
  getAllRequests: async () => {
    const response = await api.get('/admin/requests');
    return response.data;
  }
};
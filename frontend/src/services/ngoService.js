import api from './api';

export const ngoService = {
  // Create resource request
  createResourceRequest: async (requestData) => {
    const { ngoId, ...data } = requestData;
    const response = await api.post(`/ngo/requests/resource?ngoId=${ngoId}`, data);
    return response.data;
  },

  // Create volunteer request
  createVolunteerRequest: async (requestData) => {
    const { ngoId, ...data } = requestData;
    const response = await api.post(`/ngo/requests/volunteer?ngoId=${ngoId}`, data);
    return response.data;
  },

  // Get NGO's own requests
  getOwnRequests: async (ngoId) => {
    const response = await api.get(`/ngo/${ngoId}/requests`);
    return response.data;
  },

  // Update NGO details
  updateNGODetails: async (ngoId, updateData) => {
    const response = await api.put(`/ngo/${ngoId}`, updateData);
    return response.data;
  },

  // Mark request as fulfilled
  fulfillRequest: async (requestId) => {
    const response = await api.put(`/ngo/requests/${requestId}/fulfill`);
    return response.data;
  },

  // Close request
  closeRequest: async (requestId, ngoId) => {
    const response = await api.put(`/ngo/requests/${requestId}/close?ngoId=${ngoId}`);
    return response.data;
  },

  // Get request details with applicants/contributors
  getRequestDetails: async (requestId) => {
    const response = await api.get(`/ngo/requests/${requestId}/details`);
    return response.data;
  }
};
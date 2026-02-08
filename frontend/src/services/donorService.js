import api from './api';

// Helper function to get donor ID from logged in user
const getDonorId = () => {
  const user = localStorage.getItem('sahayasetu_user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Try different possible field names for donor ID
      return userData.donorId ?? userData.userId ?? userData.id ?? null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const donorService = {
  // Get available requests for donors
  getAvailableRequests: async () => {
    const donorId = getDonorId();
    const endpoint = donorId ? `/donor/requests-for-donor?donorId=${donorId}` : '/donor/requests';
    const response = await api.get(endpoint);
    return response.data;
  },

  // Donate resources
  donateResource: async (requestId, donationData) => {
    const donorId = getDonorId();
    const url = donorId
      ? `/donor/requests/${requestId}/fulfill-resource?donorId=${encodeURIComponent(donorId)}`
      : `/donor/requests/${requestId}/fulfill-resource`;

    const response = await api.post(url, { quantity: donationData.quantityReceived });
    return response.data;
  },

  // Apply for volunteer work
  applyForVolunteer: async (requestId) => {
    const donorId = getDonorId();
    const url = donorId
      ? `/donor/requests/${requestId}/volunteer?donorId=${encodeURIComponent(donorId)}`
      : `/donor/requests/${requestId}/volunteer`;

    const response = await api.post(url);
    return response.data;
  },

  // Get active fundraisers
  getActiveFundraisers: async () => {
    const response = await api.get('/donor/fundraisers');
    return response.data;
  }
};
// API Configuration
export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 10000,

  // Endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER_DONOR: '/auth/register',
      REGISTER_NGO: '/auth/register-ngo',
      REGISTER_ADMIN: '/auth/register-admin',
      LOGIN: '/auth/login',
      LOGIN_NGO: '/auth/login-ngo'
    },
    DONOR: {
      GET_REQUESTS: '/donor/requests',
      DONATE: (requestId, donorId) => `/donor/requests/${requestId}/donate?donorId=${donorId}`,
      VOLUNTEER: (requestId, donorId) => `/donor/requests/${requestId}/volunteer?donorId=${donorId}`,
      FULFILL_RESOURCE: (requestId, donorId) => `/donor/requests/${requestId}/fulfill-resource?donorId=${donorId}`
    },
    NGO: {
      CREATE_RESOURCE_REQUEST: (ngoId) => `/ngo/requests/resource?ngoId=${ngoId}`,
      CREATE_VOLUNTEER_REQUEST: (ngoId) => `/ngo/requests/volunteer?ngoId=${ngoId}`,
      CREATE_FUNDRAISER_REQUEST: (ngoId) => `/ngo/requests/fundraiser?ngoId=${ngoId}`,
      GET_REQUESTS: (ngoId) => `/ngo/${ngoId}/requests`,
      UPDATE_PROFILE: (ngoId) => `/ngo/${ngoId}`
    },
    ADMIN: {
      GET_NGOS: '/admin/ngos',
      GET_REQUESTS: '/admin/requests',
      APPROVE_NGO: (ngoId) => `/admin/ngos/${ngoId}/approve`,
      DISAPPROVE_NGO: (ngoId) => `/admin/ngos/${ngoId}/disapprove`,
      DISABLE_NGO: (ngoId) => `/admin/ngos/${ngoId}/disable`
    }
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'sahayasetu_user',
  TOKEN: 'sahayasetu_token'
};
import api from './api';

export const donorService = {
  getProfile: () => api.get('/donors/me'),
  updateAvailability: (isAvailable: boolean) => api.put('/donors/availability', { isAvailable }),
  getMatchingRequests: () => api.get('/donors/requests'),
  getResponses: () => api.get('/donors/responses'),
  getDonations: () => api.get('/donors/donations'),
};

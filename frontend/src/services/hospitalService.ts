import api from './api';

export const hospitalService = {
  getProfile: () => api.get('/hospitals/me'),
  getHospitalRequests: () => api.get('/hospitals/requests'),
  getAllHospitals: () => api.get('/hospitals'),
};

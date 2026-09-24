import api from './api';

export const bloodBankService = {
  getProfile: () => api.get('/blood-banks/me'),
  getInventory: () => api.get('/blood-banks/inventory'),
  updateInventory: (data: { bloodGroup: string; unitsAvailable: number; location?: string }) =>
    api.post('/blood-banks/inventory', data),
};

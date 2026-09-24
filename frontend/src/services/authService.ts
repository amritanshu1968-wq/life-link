import api from './api';
import { UserRole } from '../types';

export const authService = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    bloodGroup?: string;
    city?: string;
    area?: string;
    hospitalName?: string;
    bankName?: string;
  }) => api.post('/auth/register', data),

  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),

  getMe: () => api.get('/auth/me'),
};

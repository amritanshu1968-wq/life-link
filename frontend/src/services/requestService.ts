import api from './api';
import { Urgency } from '../types';

export const requestService = {
  createRequest: (data: {
    bloodGroup: string;
    unitsRequired: number;
    urgency: Urgency;
    city: string;
    area: string;
    postalCode: string;
    requiredDateTime: string;
    hospitalId?: string;
    reason?: string;
  }) => api.post('/blood-requests', data),

  getRequests: (params?: { status?: string; city?: string; bloodGroup?: string; urgency?: string; includeFulfilled?: boolean }) =>
    api.get('/blood-requests', { params }),

  getRequestById: (id: string) => api.get(`/blood-requests/${id}`),

  respondToRequest: (id: string, responseStatus: 'ACCEPTED' | 'DECLINED' | 'MAYBE', notes?: string) =>
    api.post(`/blood-requests/${id}/respond`, { responseStatus, notes }),

  withdrawResponse: (id: string, withdrawalReason: string, notes?: string) =>
    api.post(`/blood-requests/${id}/withdraw`, { withdrawalReason, notes }),

  fulfillRequest: (id: string) => api.post(`/blood-requests/${id}/fulfill`),
  cancelRequest: (id: string) => api.post(`/blood-requests/${id}/cancel`),
};

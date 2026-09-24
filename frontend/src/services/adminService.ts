import api from './api';

export const adminService = {
  getStatistics: () => api.get('/admin/statistics'),
  getUsers: () => api.get('/admin/users'),
  updateUserStatus: (id: string, status: string) => api.put(`/admin/users/${id}/status`, { status }),
  getVerifications: () => api.get('/admin/verifications'),
  updateVerificationStatus: (id: string, status: string, remarks?: string) =>
    api.put(`/admin/verifications/${id}`, { status, remarks }),
  getAuditLogs: () => api.get('/admin/audit-logs'),
};

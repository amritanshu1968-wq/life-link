import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { HowItWorksPage } from '../pages/public/HowItWorksPage';
import { FindBloodPage } from '../pages/public/FindBloodPage';
import { BloodRequestsPage } from '../pages/public/BloodRequestsPage';
import { RequestDetailsPage } from '../pages/public/RequestDetailsPage';
import { HospitalsPage } from '../pages/public/HospitalsPage';
import { BloodBanksPage } from '../pages/public/BloodBanksPage';
import { AboutPage } from '../pages/public/AboutPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Donor Pages
import { DonorDashboardPage } from '../pages/donor/DonorDashboardPage';
import { DonorProfilePage } from '../pages/donor/DonorProfilePage';
import { DonorAvailabilityPage } from '../pages/donor/DonorAvailabilityPage';
import { DonorRequestsPage } from '../pages/donor/DonorRequestsPage';
import { DonorResponsesPage } from '../pages/donor/DonorResponsesPage';
import { DonorDonationsPage } from '../pages/donor/DonorDonationsPage';
import { DonorNotificationsPage } from '../pages/donor/DonorNotificationsPage';

// Requester Pages
import { RequesterDashboardPage } from '../pages/requester/RequesterDashboardPage';
import { CreateRequestPage } from '../pages/requester/CreateRequestPage';
import { RequesterRequestsPage } from '../pages/requester/RequesterRequestsPage';
import { RequesterRequestDetailsPage } from '../pages/requester/RequesterRequestDetailsPage';
import { RequesterHistoryPage } from '../pages/requester/RequesterHistoryPage';
import { RequesterNotificationsPage } from '../pages/requester/RequesterNotificationsPage';

// Hospital Pages
import { HospitalDashboardPage } from '../pages/hospital/HospitalDashboardPage';
import { HospitalProfilePage } from '../pages/hospital/HospitalProfilePage';
import { HospitalCreateRequestPage } from '../pages/hospital/HospitalCreateRequestPage';
import { HospitalRequestsPage } from '../pages/hospital/HospitalRequestsPage';
import { HospitalMatchingPage } from '../pages/hospital/HospitalMatchingPage';
import { HospitalInventoryPage } from '../pages/hospital/HospitalInventoryPage';
import { HospitalHistoryPage } from '../pages/hospital/HospitalHistoryPage';
import { HospitalNotificationsPage } from '../pages/hospital/HospitalNotificationsPage';

// Blood Bank Pages
import { BloodBankDashboardPage } from '../pages/bloodbank/BloodBankDashboardPage';
import { BloodBankProfilePage } from '../pages/bloodbank/BloodBankProfilePage';
import { BloodBankInventoryPage } from '../pages/bloodbank/BloodBankInventoryPage';
import { BloodBankRequestsPage } from '../pages/bloodbank/BloodBankRequestsPage';
import { BloodBankResponsesPage } from '../pages/bloodbank/BloodBankResponsesPage';
import { BloodBankHistoryPage } from '../pages/bloodbank/BloodBankHistoryPage';
import { BloodBankNotificationsPage } from '../pages/bloodbank/BloodBankNotificationsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminHospitalsPage } from '../pages/admin/AdminHospitalsPage';
import { AdminBloodBanksPage } from '../pages/admin/AdminBloodBanksPage';
import { AdminVerificationsPage } from '../pages/admin/AdminVerificationsPage';
import { AdminRequestsPage } from '../pages/admin/AdminRequestsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/find-blood" element={<FindBloodPage />} />
        <Route path="/blood-requests" element={<BloodRequestsPage />} />
        <Route path="/blood-requests/:id" element={<RequestDetailsPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/blood-banks" element={<BloodBanksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* DONOR PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['DONOR', 'ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/donor/dashboard" element={<DonorDashboardPage />} />
          <Route path="/donor/profile" element={<DonorProfilePage />} />
          <Route path="/donor/availability" element={<DonorAvailabilityPage />} />
          <Route path="/donor/requests" element={<DonorRequestsPage />} />
          <Route path="/donor/responses" element={<DonorResponsesPage />} />
          <Route path="/donor/donations" element={<DonorDonationsPage />} />
          <Route path="/donor/notifications" element={<DonorNotificationsPage />} />
        </Route>
      </Route>

      {/* REQUESTER PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['REQUESTER', 'ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/requester/dashboard" element={<RequesterDashboardPage />} />
          <Route path="/requester/create-request" element={<CreateRequestPage />} />
          <Route path="/requester/requests" element={<RequesterRequestsPage />} />
          <Route path="/requester/requests/:id" element={<RequesterRequestDetailsPage />} />
          <Route path="/requester/history" element={<RequesterHistoryPage />} />
          <Route path="/requester/notifications" element={<RequesterNotificationsPage />} />
        </Route>
      </Route>

      {/* HOSPITAL PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['HOSPITAL', 'ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/hospital/dashboard" element={<HospitalDashboardPage />} />
          <Route path="/hospital/profile" element={<HospitalProfilePage />} />
          <Route path="/hospital/create-request" element={<HospitalCreateRequestPage />} />
          <Route path="/hospital/requests" element={<HospitalRequestsPage />} />
          <Route path="/hospital/matching" element={<HospitalMatchingPage />} />
          <Route path="/hospital/inventory" element={<HospitalInventoryPage />} />
          <Route path="/hospital/history" element={<HospitalHistoryPage />} />
          <Route path="/hospital/notifications" element={<HospitalNotificationsPage />} />
        </Route>
      </Route>

      {/* BLOOD BANK PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['BLOOD_BANK', 'ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/blood-bank/dashboard" element={<BloodBankDashboardPage />} />
          <Route path="/blood-bank/profile" element={<BloodBankProfilePage />} />
          <Route path="/blood-bank/inventory" element={<BloodBankInventoryPage />} />
          <Route path="/blood-bank/requests" element={<BloodBankRequestsPage />} />
          <Route path="/blood-bank/responses" element={<BloodBankResponsesPage />} />
          <Route path="/blood-bank/history" element={<BloodBankHistoryPage />} />
          <Route path="/blood-bank/notifications" element={<BloodBankNotificationsPage />} />
        </Route>
      </Route>

      {/* ADMIN PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/hospitals" element={<AdminHospitalsPage />} />
          <Route path="/admin/blood-banks" element={<AdminBloodBanksPage />} />
          <Route path="/admin/verifications" element={<AdminVerificationsPage />} />
          <Route path="/admin/requests" element={<AdminRequestsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

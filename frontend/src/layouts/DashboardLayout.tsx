import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  Droplet,
  FileText,
  Clock,
  Bell,
  Building2,
  Database,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getRoleNavLinks = () => {
    switch (user.role) {
      case 'DONOR':
        return [
          { name: 'Dashboard', path: '/donor/dashboard', icon: LayoutDashboard },
          { name: 'Availability', path: '/donor/availability', icon: UserCheck },
          { name: 'Nearby Requests', path: '/donor/requests', icon: Droplet },
          { name: 'My Responses', path: '/donor/responses', icon: FileText },
          { name: 'Donation History', path: '/donor/donations', icon: Clock },
          { name: 'Notifications', path: '/donor/notifications', icon: Bell },
        ];
      case 'REQUESTER':
        return [
          { name: 'Dashboard', path: '/requester/dashboard', icon: LayoutDashboard },
          { name: 'Create Request', path: '/requester/create-request', icon: PlusCircle },
          { name: 'Active Requests', path: '/requester/requests', icon: Droplet },
          { name: 'Request History', path: '/requester/history', icon: Clock },
          { name: 'Notifications', path: '/requester/notifications', icon: Bell },
        ];
      case 'HOSPITAL':
        return [
          { name: 'Dashboard', path: '/hospital/dashboard', icon: LayoutDashboard },
          { name: 'Create Request', path: '/hospital/create-request', icon: PlusCircle },
          { name: 'Hospital Requests', path: '/hospital/requests', icon: Droplet },
          { name: 'Matching Donors', path: '/hospital/matching', icon: UserCheck },
          { name: 'Inventory View', path: '/hospital/inventory', icon: Database },
          { name: 'History', path: '/hospital/history', icon: Clock },
          { name: 'Notifications', path: '/hospital/notifications', icon: Bell },
        ];
      case 'BLOOD_BANK':
        return [
          { name: 'Dashboard', path: '/blood-bank/dashboard', icon: LayoutDashboard },
          { name: 'Inventory Stock', path: '/blood-bank/inventory', icon: Database },
          { name: 'Blood Requests', path: '/blood-bank/requests', icon: Droplet },
          { name: 'History', path: '/blood-bank/history', icon: Clock },
          { name: 'Notifications', path: '/blood-bank/notifications', icon: Bell },
        ];
      case 'ADMIN':
        return [
          { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', path: '/admin/users', icon: UserCheck },
          { name: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
          { name: 'Blood Banks', path: '/admin/blood-banks', icon: Database },
          { name: 'Verifications', path: '/admin/verifications', icon: ShieldCheck },
          { name: 'Requests Monitor', path: '/admin/requests', icon: Droplet },
          { name: 'System Reports', path: '/admin/reports', icon: FileText },
          { name: 'Audit Logs', path: '/admin/audit-logs', icon: Clock },
        ];
      default:
        return [];
    }
  };

  const navLinks = getRoleNavLinks();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-8 py-6 flex-grow grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-7 items-start">
        {/* Sidebar Navigation */}
        <aside className="w-[240px] flex-shrink-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-fit sticky top-20">
          <div className="mb-4 pb-3 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{user.role} PANEL</h3>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{user.name}</p>
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 font-semibold border-l-2 border-red-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartHandshake, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'DONOR':
        return '/donor/dashboard';
      case 'REQUESTER':
        return '/requester/dashboard';
      case 'HOSPITAL':
        return '/hospital/dashboard';
      case 'BLOOD_BANK':
        return '/blood-bank/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-red-600 font-bold text-xl tracking-tight">
              <HeartHandshake className="w-7 h-7" />
              <span>LIFE-LINK</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
              <Link to="/find-blood" className="hover:text-red-600 transition-colors">
                Find Blood
              </Link>
              <Link to="/blood-requests" className="hover:text-red-600 transition-colors">
                Active Requests
              </Link>
              <Link to="/how-it-works" className="hover:text-red-600 transition-colors">
                How It Works
              </Link>
              <Link to="/hospitals" className="hover:text-red-600 transition-colors">
                Hospitals
              </Link>
              <Link to="/blood-banks" className="hover:text-red-600 transition-colors">
                Blood Banks
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-gray-300 text-xs font-semibold rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span>{user.name} ({user.role})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

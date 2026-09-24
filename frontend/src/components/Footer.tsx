import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">LIFE-LINK</h4>
            <p className="text-xs text-gray-600">
              Smart Blood Donation & Emergency Response Coordination Platform.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 text-xs mb-2">Quick Links</h5>
            <ul className="space-y-1 text-xs">
              <li><Link to="/find-blood" className="hover:text-red-600">Find Blood</Link></li>
              <li><Link to="/blood-requests" className="hover:text-red-600">Active Requests</Link></li>
              <li><Link to="/how-it-works" className="hover:text-red-600">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 text-xs mb-2">Facilities</h5>
            <ul className="space-y-1 text-xs">
              <li><Link to="/hospitals" className="hover:text-red-600">Registered Hospitals</Link></li>
              <li><Link to="/blood-banks" className="hover:text-red-600">Blood Bank Inventories</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 text-xs mb-2">Emergency Disclaimer</h5>
            <p className="text-[11px] text-gray-500">
              Blood compatibility matching is based on registered ABO/Rh groups. Final donor eligibility must be confirmed by attending medical professionals.
            </p>
          </div>
        </div>
        <div className="pt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LIFE-LINK Healthcare Infrastructure. Built for real-world emergency coordination.
        </div>
      </div>
    </footer>
  );
};

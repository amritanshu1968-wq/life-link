import React from 'react';
import { RequestStatus, Urgency } from '../types';

interface StatusBadgeProps {
  status?: RequestStatus | string;
  urgency?: Urgency | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, urgency }) => {
  if (urgency === 'EMERGENCY') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
        🚨 EMERGENCY
      </span>
    );
  }

  if (urgency === 'URGENT') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        ⚡ URGENT
      </span>
    );
  }

  switch (status) {
    case 'OPEN':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          OPEN
        </span>
      );
    case 'MATCHING':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
          MATCHING DONORS
        </span>
      );
    case 'RESPONSES_RECEIVED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          RESPONSES RECEIVED
        </span>
      );
    case 'DONOR_CONFIRMED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
          DONOR CONFIRMED
        </span>
      );
    case 'FULFILLED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✓ FULFILLED
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          CANCELLED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {status || 'NORMAL'}
        </span>
      );
  }
};

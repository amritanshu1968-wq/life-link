import React from 'react';
import { Clock, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';

interface VerificationBadgeProps {
  status?: string;
  entityName?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, entityName = 'HOSPITAL' }) => {
  const normalizedStatus = (status || 'PENDING').toUpperCase();

  switch (normalizedStatus) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-4 h-4 mr-1 text-amber-600" /> 🕒 PENDING VERIFICATION
        </span>
      );
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" /> ✓ VERIFIED {entityName}
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
          <XCircle className="w-4 h-4 mr-1 text-red-600" /> ✕ VERIFICATION REJECTED
        </span>
      );
    case 'SUSPENDED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
          <AlertTriangle className="w-4 h-4 mr-1 text-gray-600" /> ⚠️ SUSPENDED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-4 h-4 mr-1 text-amber-600" /> 🕒 PENDING VERIFICATION
        </span>
      );
  }
};

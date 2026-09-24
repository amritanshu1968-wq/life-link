import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { StatusBadge } from '../../components/StatusBadge';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { MapPin, ArrowRight } from 'lucide-react';

export const DonorRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    donorService.getMatchingRequests()
      .then((res: any) => {
        if (res.success) setRequests(res.data?.requests || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading matching requests...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Matching Emergency Requests</h1>
        <p className="text-xs text-gray-500">Blood requests matching your registered blood group and proximity.</p>
      </div>

      <MedicalDisclaimerAlert />

      {requests.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
          No matching active requests found for your availability.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-600 text-sm">REQ-{req.id.slice(0, 8)}</span>
                <div className="flex space-x-2">
                  <StatusBadge urgency={req.urgency} />
                  <StatusBadge status={req.status} />
                </div>
              </div>

              <div className="text-xs space-y-1">
                <p className="font-medium text-gray-800">{req.unitsRequired} Unit(s) of {req.bloodGroup}</p>
                <p className="text-gray-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {req.area}, {req.city} ({req.postalCode})
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] text-gray-400">
                  Required: {new Date(req.requiredDateTime).toLocaleDateString()}
                </span>
                <Link
                  to={`/blood-requests/${req.id}`}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded inline-flex items-center space-x-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

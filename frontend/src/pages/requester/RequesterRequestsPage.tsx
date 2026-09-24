import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { BloodRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { PlusCircle, ArrowRight } from 'lucide-react';

export const RequesterRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    requestService.getRequests()
      .then((res: any) => {
        if (res.success) setRequests(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading request tickets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Active Blood Request Tickets</h1>
          <p className="text-xs text-gray-500">Track current tickets and view responding donor profiles.</p>
        </div>
        <Link
          to="/requester/create-request"
          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded inline-flex items-center space-x-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Request</span>
        </Link>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-red-600 text-sm">REQ-{req.id.slice(0, 8)}</span>
                <span className="font-bold text-gray-900 text-xs">({req.unitsRequired} Units {req.bloodGroup})</span>
                <StatusBadge urgency={req.urgency} />
                <StatusBadge status={req.status} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{req.area}, {req.city} • Required: {new Date(req.requiredDateTime).toLocaleString()}</p>
            </div>

            <Link
              to={`/requester/requests/${req.id}`}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs rounded inline-flex items-center space-x-1"
            >
              <span>Manage Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

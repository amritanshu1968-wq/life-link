import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { BloodRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { PlusCircle, ArrowRight, Droplet } from 'lucide-react';

export const RequesterDashboardPage: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    requestService.getRequests()
      .then((res: any) => {
        if (res.success) setRequests(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading requester dashboard...</div>;

  const openRequests = requests.filter((r) => !['FULFILLED', 'CANCELLED'].includes(r.status));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Requester Control Panel</h1>
          <p className="text-xs text-gray-500">Manage blood request tickets and monitor matching donor responses.</p>
        </div>

        <Link
          to="/requester/create-request"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded shadow-sm inline-flex items-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Blood Request</span>
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Active Request Tickets ({openRequests.length})</h3>

        {openRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
            You have no active blood request tickets.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openRequests.map((req) => (
              <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-red-600 text-sm">REQ-{req.id.slice(0, 8)}</span>
                  <div className="flex space-x-2">
                    <StatusBadge urgency={req.urgency} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-semibold text-gray-900">{req.unitsRequired} Unit(s) of {req.bloodGroup}</p>
                  <p className="text-gray-500">{req.area}, {req.city}</p>
                  <p className="text-gray-600">Responses: {req.donorResponses?.length || 0} Donor(s)</p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-end">
                  <Link
                    to={`/requester/requests/${req.id}`}
                    className="text-xs font-semibold text-red-600 hover:underline inline-flex items-center"
                  >
                    Manage & Responses <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

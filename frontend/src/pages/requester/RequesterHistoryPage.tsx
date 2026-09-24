import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { BloodRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

export const RequesterHistoryPage: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    requestService.getRequests()
      .then((res: any) => {
        if (res.success) setRequests(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading request history...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blood Request Ticket History</h1>
        <p className="text-xs text-gray-500">Complete archive of fulfilled and past blood request tickets.</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 font-semibold border-b border-gray-200">
            <tr>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Blood Group</th>
              <th className="p-3">Units</th>
              <th className="p-3">Urgency</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-red-600">REQ-{req.id.slice(0, 8)}</td>
                <td className="p-3 font-bold">{req.bloodGroup}</td>
                <td className="p-3">{req.unitsRequired}</td>
                <td className="p-3"><StatusBadge urgency={req.urgency} /></td>
                <td className="p-3"><StatusBadge status={req.status} /></td>
                <td className="p-3 text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

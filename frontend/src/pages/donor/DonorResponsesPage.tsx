import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { StatusBadge } from '../../components/StatusBadge';

export const DonorResponsesPage: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    donorService.getResponses()
      .then((res: any) => {
        if (res.success) setResponses(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading your responses...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Response History</h1>
        <p className="text-xs text-gray-500">History of emergency blood request invitations you responded to.</p>
      </div>

      {responses.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
          You have not responded to any blood requests yet.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Request Ticket</th>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Your Response</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Responded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {responses.map((resp) => (
                <tr key={resp.id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-red-600">REQ-{resp.bloodRequestId.slice(0, 8)}</td>
                  <td className="p-3 font-bold">{resp.bloodRequest?.bloodGroup}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        resp.responseStatus === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {resp.responseStatus}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{resp.notes || '-'}</td>
                  <td className="p-3 text-gray-400">{new Date(resp.respondedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

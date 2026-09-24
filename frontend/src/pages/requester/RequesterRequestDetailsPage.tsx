import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { BloodRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { CheckCircle, XCircle, ShieldCheck, MapPin, Clock } from 'lucide-react';

export const RequesterRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');

  const fetchDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res: any = await requestService.getRequestById(id);
      if (res.success && res.data) {
        setRequest(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleFulfill = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      const res: any = await requestService.fulfillRequest(id);
      if (res.success) {
        setMsg('Request ticket successfully marked as FULFILLED.');
        fetchDetails();
      }
    } catch (err: any) {
      setMsg(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      const res: any = await requestService.cancelRequest(id);
      if (res.success) {
        setMsg('Request ticket marked as CANCELLED.');
        fetchDetails();
      }
    } catch (err: any) {
      setMsg(err.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading request ticket...</div>;
  if (!request) return <div className="text-center py-8 text-xs text-red-600">Ticket not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-red-600 text-lg">
              {request.requestCode || `LL-${request.id.slice(0, 8)}`}
            </span>
            <StatusBadge urgency={request.urgency} />
            <StatusBadge status={request.status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Created on {new Date(request.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex space-x-2">
          {request.status !== 'FULFILLED' && request.status !== 'CANCELLED' && (
            <>
              <button
                onClick={handleFulfill}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded inline-flex items-center space-x-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Fulfilled</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs rounded inline-flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5 text-gray-600" />
                <span>Cancel Ticket</span>
              </button>
            </>
          )}
        </div>
      </div>

      <MedicalDisclaimerAlert />

      {msg && <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded">{msg}</div>}

      {/* Ticket Specs */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-gray-500 block">Blood Group:</span>
          <span className="font-extrabold text-red-600 text-sm">{request.bloodGroup}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Units Required:</span>
          <span className="font-semibold text-gray-900">{request.unitsRequired} Unit(s)</span>
        </div>
        <div>
          <span className="text-gray-500 block">Location:</span>
          <span className="font-medium text-gray-900">{request.area}, {request.city}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Required DateTime:</span>
          <span className="font-medium text-gray-900">{new Date(request.requiredDateTime).toLocaleString()}</span>
        </div>
      </div>

      {/* Matching Responses Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-sm">Received Responses ({request.donorResponses?.length || 0})</h3>

        {(!request.donorResponses || request.donorResponses.length === 0) ? (
          <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
            No donor responses recorded yet. Active notifications have been dispatched to compatible nearby donors.
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-3">Donor Name / ID</th>
                  <th className="p-3">Blood Group</th>
                  <th className="p-3">Approx Distance</th>
                  <th className="p-3">Response Status</th>
                  <th className="p-3">Responded At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {request.donorResponses.map((resp: any) => (
                  <tr key={resp.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">
                      {resp.donor?.user?.name || `Donor #${resp.donorId.slice(0, 6)}`}
                    </td>
                    <td className="p-3 font-bold text-red-600">{request.bloodGroup}</td>
                    <td className="p-3 text-gray-600">Approx 3.5 km</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          resp.responseStatus === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : resp.responseStatus === 'WITHDRAWN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {resp.responseStatus}
                      </span>
                      {resp.withdrawalReason && (
                        <p className="text-[10px] text-amber-800 font-semibold mt-0.5">
                          Reason: {resp.withdrawalReason.replace(/_/g, ' ')}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-gray-400">
                      {new Date(resp.respondedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

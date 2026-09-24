import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';
import { StatusBadge } from '../../components/StatusBadge';
import { VerificationBadge } from '../../components/VerificationBadge';
import { PlusCircle, Building2, UserCheck, Clock } from 'lucide-react';

export const HospitalDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([hospitalService.getProfile(), hospitalService.getHospitalRequests()])
      .then(([profRes, reqRes]: any[]) => {
        if (profRes.success) setProfile(profRes.data);
        if (reqRes.success) setRequests(reqRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading hospital dashboard...</div>;

  const activeReqs = requests.filter((r) => !['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(r.status));
  const emergencyReqs = requests.filter((r) => r.urgency === 'EMERGENCY' && !['FULFILLED', 'CANCELLED'].includes(r.status));
  const fulfilledReqs = requests.filter((r) => r.status === 'FULFILLED');

  // Total valid responses across all hospital requests
  const totalResponsesCount = requests.reduce(
    (acc, r) => acc + (r.donorResponses?.filter((dr: any) => dr.responseStatus === 'ACCEPTED')?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-gray-900">{profile?.hospitalName}</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">{profile?.address}, {profile?.city}</p>
        </div>

        <div className="flex items-center space-x-3">
          <VerificationBadge status={profile?.verificationStatus} entityName="HOSPITAL" />
          <Link
            to="/hospital/create-request"
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded inline-flex items-center space-x-1 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Request</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Active Requests</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{activeReqs.length}</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-red-600 font-semibold uppercase">Emergency Requests</span>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{emergencyReqs.length}</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-gray-500 font-semibold uppercase">Total Accepted Responses</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{totalResponsesCount}</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <span className="text-xs text-emerald-600 font-semibold uppercase">Fulfilled Requests</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{fulfilledReqs.length}</p>
        </div>
      </div>

      {/* Hospital Requests & Responses */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Hospital Blood Requests & Received Responses</h3>
        {requests.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
            No blood requests created by this hospital yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b border-gray-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-red-600 text-sm">{req.requestCode || `LL-${req.id.slice(0, 8)}`}</span>
                    <span className="font-bold text-gray-900">({req.unitsRequired} Units {req.bloodGroup})</span>
                    <StatusBadge urgency={req.urgency} />
                    <StatusBadge status={req.status} />
                  </div>
                  <span className="text-gray-500 font-semibold">
                    Received Responses: {req.donorResponses?.length || 0}
                  </span>
                </div>

                {(!req.donorResponses || req.donorResponses.length === 0) ? (
                  <p className="text-xs text-gray-400">No donor responses recorded yet.</p>
                ) : (
                  <div className="divide-y divide-gray-100 text-xs">
                    {req.donorResponses.map((resp: any) => (
                      <div key={resp.id} className="py-2.5 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Donor: {resp.donor?.user?.name || `DNR-${resp.donorId.slice(0, 6)}`}
                          </p>
                          <p className="text-gray-500 text-[11px] flex items-center mt-0.5">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            Responded: {new Date(resp.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Approx 3.5 km away
                          </p>
                          {resp.withdrawalReason && (
                            <p className="text-amber-800 text-[11px] font-semibold mt-0.5">
                              Withdrawal Reason: {resp.withdrawalReason.replace(/_/g, ' ')}
                            </p>
                          )}
                        </div>

                        <div>
                          <span
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              resp.responseStatus === 'ACCEPTED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : resp.responseStatus === 'WITHDRAWN'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {resp.responseStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

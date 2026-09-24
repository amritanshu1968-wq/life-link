import React, { useState, useEffect } from 'react';
import { hospitalService } from '../../services/hospitalService';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const HospitalMatchingPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    hospitalService.getHospitalRequests()
      .then((res: any) => {
        if (res.success) setRequests(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading matching donor data...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Matching Compatible Donors</h1>
        <p className="text-xs text-gray-500">View donors who have responded to hospital blood requests.</p>
      </div>

      <MedicalDisclaimerAlert />

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="font-bold text-red-600 text-xs">REQ-{req.id.slice(0, 8)} ({req.unitsRequired} Units {req.bloodGroup})</span>
              <span className="text-xs text-gray-500">{req.donorResponses?.length || 0} Donor Responses</span>
            </div>

            {(!req.donorResponses || req.donorResponses.length === 0) ? (
              <div className="text-xs text-gray-400 py-2">No responses received yet for this ticket.</div>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {req.donorResponses.map((resp: any) => (
                  <div key={resp.id} className="py-2 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900">Donor #{resp.donorId.slice(0, 6)}</span>
                      <p className="text-gray-500 text-[11px]">{resp.notes || 'No extra notes'}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
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
    </div>
  );
};

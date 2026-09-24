import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { VerificationBadge } from '../../components/VerificationBadge';
import { Check, X } from 'lucide-react';

export const AdminVerificationsPage: React.FC = () => {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const res: any = await adminService.getVerifications();
      if (res.success) setVerifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleUpdate = async (id: string, status: string) => {
    try {
      await adminService.updateVerificationStatus(id, status, `Reviewed by administrator on ${new Date().toLocaleDateString()}`);
      fetchVerifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading verifications...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hospital & Blood Bank Verifications</h1>
        <p className="text-xs text-gray-500">Regulatory & healthcare facility verification review queue.</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 font-semibold border-b border-gray-200 uppercase">
            <tr>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Facility / User Account</th>
              <th className="p-3">Verification Status</th>
              <th className="p-3">Remarks</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {verifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No verification records found in queue.
                </td>
              </tr>
            ) : (
              verifications.map((v) => {
                const facilityName =
                  v.user?.hospitalProfile?.hospitalName ||
                  v.user?.bloodBankProfile?.bankName;

                return (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">{v.entityType}</td>
                    <td className="p-3">
                      {facilityName && (
                        <span className="font-bold text-gray-900 block text-xs">
                          {facilityName}
                        </span>
                      )}
                      <span className="text-gray-600 text-[11px]">
                        {v.user?.name} ({v.user?.email})
                      </span>
                    </td>
                    <td className="p-3">
                      <VerificationBadge status={v.status} entityName={v.entityType} />
                    </td>
                    <td className="p-3 text-gray-500">{v.remarks || '-'}</td>
                    <td className="p-3 space-x-2">
                      {v.status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleUpdate(v.id, 'VERIFIED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded inline-flex items-center shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve
                        </button>
                      )}
                      {v.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleUpdate(v.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded inline-flex items-center shadow-sm"
                        >
                          <X className="w-3.5 h-3.5 mr-1 text-red-600" /> Reject
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { ShieldCheck } from 'lucide-react';

export const DonorDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    donorService.getDonations()
      .then((res: any) => {
        if (res.success) setDonations(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading donation records...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Donation History</h1>
        <p className="text-xs text-gray-500">Records of completed blood donations confirmed by participating hospitals.</p>
      </div>

      {donations.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
          No verified donation records found.
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Hospital Facility</th>
                <th className="p-3">Units Donated</th>
                <th className="p-3">Donation Date</th>
                <th className="p-3">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-900">{d.hospital?.hospitalName || 'Medical Center'}</td>
                  <td className="p-3 font-bold text-red-600">{d.units} Unit(s)</td>
                  <td className="p-3 text-gray-600">{new Date(d.donationDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

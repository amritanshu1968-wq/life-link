import React, { useState, useEffect } from 'react';
import { bloodBankService } from '../../services/bloodBankService';
import { VerificationBadge } from '../../components/VerificationBadge';
import { Database } from 'lucide-react';

export const BloodBankProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    bloodBankService.getProfile()
      .then((res: any) => {
        if (res.success) setProfile(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading blood bank profile...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blood Bank Profile</h1>
        <p className="text-xs text-gray-500">Facility verification and contact information.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <Database className="w-8 h-8 text-red-600" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{profile?.bankName}</h3>
            <p className="text-gray-500">{profile?.address}, {profile?.city} ({profile?.postalCode})</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 block mb-1">Verification Status:</span>
            <VerificationBadge status={profile?.verificationStatus} entityName="BLOOD BANK" />
          </div>

          <div>
            <span className="text-gray-500 block">Contact Administrator:</span>
            <span className="font-medium text-gray-900">{profile?.user?.name}</span>
          </div>

          <div>
            <span className="text-gray-500 block">Email:</span>
            <span className="font-medium text-gray-900">{profile?.user?.email}</span>
          </div>

          <div>
            <span className="text-gray-500 block">Phone:</span>
            <span className="font-medium text-gray-900">{profile?.user?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

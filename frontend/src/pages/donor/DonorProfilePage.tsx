import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { User, ShieldCheck } from 'lucide-react';

export const DonorProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    donorService.getProfile()
      .then((res: any) => {
        if (res.success) setProfile(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Donor Profile</h1>
        <p className="text-xs text-gray-500">Your registered blood group and proximity details.</p>
      </div>

      <MedicalDisclaimerAlert />

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{profile?.user?.name}</h3>
            <p className="text-gray-500">{profile?.user?.email} • {profile?.user?.phone}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 block">Registered Blood Group:</span>
            <span className="font-extrabold text-red-600 text-sm">{profile?.bloodGroup}</span>
          </div>

          <div>
            <span className="text-gray-500 block">Verification Status:</span>
            <span className="font-semibold text-emerald-700 inline-flex items-center mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {profile?.verificationStatus || 'VERIFIED'}
            </span>
          </div>

          <div>
            <span className="text-gray-500 block">City & Area:</span>
            <span className="font-medium text-gray-900">{profile?.area}, {profile?.city} ({profile?.postalCode})</span>
          </div>

          <div>
            <span className="text-gray-500 block">Current Status:</span>
            <span className="font-semibold text-gray-900">{profile?.isAvailable ? 'Available for Donation' : 'Unavailable'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

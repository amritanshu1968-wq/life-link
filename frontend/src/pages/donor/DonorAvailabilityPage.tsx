import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { AvailabilityToggle } from '../../components/AvailabilityToggle';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';

export const DonorAvailabilityPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res: any = await donorService.getProfile();
      if (res.success) setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading donor availability settings...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Donation Availability Controls</h1>
        <p className="text-xs text-gray-500">Manage your current availability to receive emergency blood requests.</p>
      </div>

      <MedicalDisclaimerAlert />

      <AvailabilityToggle initialAvailable={profile?.isAvailable ?? true} />

      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-xs text-gray-600">
        <h4 className="font-semibold text-gray-900">Privacy Guarantee</h4>
        <p>Your exact residential coordinates are never displayed publicly or to requesters. Requesters are only shown approximate distance ranges (e.g. approx 3-5 km away).</p>
      </div>
    </div>
  );
};

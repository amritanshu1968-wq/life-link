import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { donorService } from '../../services/donorService';
import { AvailabilityToggle } from '../../components/AvailabilityToggle';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { StatusBadge } from '../../components/StatusBadge';
import { ShieldCheck, MapPin, ArrowRight, Heart } from 'lucide-react';

export const DonorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [matchingRequests, setMatchingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, reqRes]: any[] = await Promise.all([
        donorService.getProfile(),
        donorService.getMatchingRequests(),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (reqRes.success) setMatchingRequests(reqRes.data?.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-xs text-gray-500">Loading donor dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
            <span>Blood Group: <strong className="text-red-600 text-sm">{profile?.bloodGroup || 'O+'}</strong></span>
            <span>•</span>
            <span className="flex items-center text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Donor
            </span>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <AvailabilityToggle initialAvailable={profile?.isAvailable ?? true} />
        </div>
      </div>

      <MedicalDisclaimerAlert />

      {/* Nearby Matching Requests */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-sm">Nearby Matching Requests</h3>
          <Link to="/donor/requests" className="text-xs text-red-600 font-semibold hover:underline">
            View All ({matchingRequests.length})
          </Link>
        </div>

        {matchingRequests.length === 0 ? (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs text-gray-500">
            No active blood requests currently match your registered blood group and availability.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingRequests.slice(0, 4).map((req) => (
              <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-600 text-sm">REQ-{req.id.slice(0, 8)}</span>
                  <div className="flex space-x-2">
                    <StatusBadge urgency={req.urgency} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-medium text-gray-800">{req.unitsRequired} Unit(s) of {req.bloodGroup}</p>
                  <p className="text-gray-500 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    Approx 3.5 km away ({req.area}, {req.city})
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">
                    {req.hasResponded ? 'Already Responded' : 'Awaiting Response'}
                  </span>
                  <Link
                    to={`/blood-requests/${req.id}`}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded inline-flex items-center space-x-1"
                  >
                    <span>View Request</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

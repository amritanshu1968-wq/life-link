import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bloodBankService } from '../../services/bloodBankService';
import { VerificationBadge } from '../../components/VerificationBadge';
import { Database, Clock } from 'lucide-react';

export const BloodBankDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([bloodBankService.getProfile(), bloodBankService.getInventory()])
      .then(([profRes, invRes]: any[]) => {
        if (profRes.success) setProfile(profRes.data);
        if (invRes.success && invRes.data) setInventory(invRes.data.inventory || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading blood bank dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-gray-900">{profile?.bankName}</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">{profile?.address}, {profile?.city}</p>
        </div>

        <VerificationBadge status={profile?.verificationStatus} entityName="BLOOD BANK" />
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-sm">Live Inventory Overview</h3>
        <Link to="/blood-bank/inventory" className="text-xs font-semibold text-red-600 hover:underline">
          Manage Inventory Stock →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-red-600 text-base">{item.bloodGroup}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  item.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'LOW'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">{item.unitsAvailable} Units</p>
            <p className="text-[11px] text-gray-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

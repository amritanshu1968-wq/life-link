import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminStats } from '../../types';
import { Users, UserCheck, Droplet, AlertTriangle, Building2, Database, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService.getStatistics()
      .then((res: any) => {
        if (res.success) setStats(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading admin statistics...</div>;

  const chartData = [
    { name: 'Active Donors', count: stats?.activeDonors || 0 },
    { name: 'Open Requests', count: stats?.openRequests || 0 },
    { name: 'Emergencies', count: stats?.emergencyRequests || 0 },
    { name: 'Fulfilled', count: stats?.fulfilledRequests || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">System Administration Overview</h1>
        <p className="text-xs text-gray-500">Platform-wide statistics and healthcare system metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          <div>
            <span className="text-xs text-gray-500 font-semibold block">Total Users</span>
            <span className="text-xl font-extrabold text-gray-900">{stats?.totalUsers || 0}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><UserCheck className="w-5 h-5" /></div>
          <div>
            <span className="text-xs text-gray-500 font-semibold block">Active Donors</span>
            <span className="text-xl font-extrabold text-emerald-600">{stats?.activeDonors || 0}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Droplet className="w-5 h-5" /></div>
          <div>
            <span className="text-xs text-gray-500 font-semibold block">Open Requests</span>
            <span className="text-xl font-extrabold text-gray-900">{stats?.openRequests || 0}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center space-x-3">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
          <div>
            <span className="text-xs text-red-600 font-semibold block">Emergencies</span>
            <span className="text-xl font-extrabold text-red-600">{stats?.emergencyRequests || 0}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
          <span className="text-gray-600 flex items-center"><Building2 className="w-4 h-4 mr-1.5 text-blue-600" /> Verified Hospitals</span>
          <span className="font-extrabold text-gray-900 text-sm">{stats?.verifiedHospitals || 0}</span>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
          <span className="text-gray-600 flex items-center"><Database className="w-4 h-4 mr-1.5 text-emerald-600" /> Verified Blood Banks</span>
          <span className="font-extrabold text-gray-900 text-sm">{stats?.verifiedBloodBanks || 0}</span>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex justify-between items-center">
          <span className="text-gray-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Fulfilled Requests</span>
          <span className="font-extrabold text-emerald-600 text-sm">{stats?.fulfilledRequests || 0}</span>
        </div>
      </div>

      {/* Simple Clean Recharts Analytics */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-900 text-sm">System Performance Chart</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

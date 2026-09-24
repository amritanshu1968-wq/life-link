import React from 'react';
import { Database, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

export const BloodBanksPage: React.FC = () => {
  const inventoryData = [
    { bloodGroup: 'O+', units: 12, status: 'Available', lastUpdated: '10 min ago' },
    { bloodGroup: 'A+', units: 7, status: 'Available', lastUpdated: '20 min ago' },
    { bloodGroup: 'B+', units: 2, status: 'Low', lastUpdated: '15 min ago' },
    { bloodGroup: 'O-', units: 5, status: 'Available', lastUpdated: '5 min ago' },
    { bloodGroup: 'AB+', units: 8, status: 'Available', lastUpdated: '30 min ago' },
    { bloodGroup: 'A-', units: 1, status: 'Low', lastUpdated: '45 min ago' },
    { bloodGroup: 'B-', units: 3, status: 'Available', lastUpdated: '1 hour ago' },
    { bloodGroup: 'AB-', units: 0, status: 'Out of Stock', lastUpdated: '2 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regional Blood Bank Inventories</h1>
        <p className="text-sm text-gray-600">Real-time inventory records provided by verified regional blood banks.</p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-900 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span>
          Inventory stock levels represent recorded updates. Availability must be verified directly with blood bank staff before emergency dispatch.
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-gray-900 text-sm">Regional City Blood Bank & Reserve</h3>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded inline-flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> Verified Facility
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-100 text-gray-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Blood Group</th>
                <th className="p-3">Units Available</th>
                <th className="p-3">Stock Status</th>
                <th className="p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryData.map((item) => (
                <tr key={item.bloodGroup} className="hover:bg-gray-50">
                  <td className="p-3 font-extrabold text-red-600 text-sm">{item.bloodGroup}</td>
                  <td className="p-3 font-semibold text-gray-900">{item.units} Units</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === 'Available'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Low'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-gray-400" />
                    {item.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

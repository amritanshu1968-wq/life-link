import React, { useState, useEffect } from 'react';
import { bloodBankService } from '../../services/bloodBankService';
import { BloodGroup } from '../../types';
import { Database, Clock, Plus, AlertTriangle } from 'lucide-react';

export const BloodBankInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [unitsAvailable, setUnitsAvailable] = useState<number>(10);
  const [location, setLocation] = useState<string>('Cold Storage Unit 1');
  const [updating, setUpdating] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res: any = await bloodBankService.getInventory();
      if (res.success && res.data) {
        setInventory(res.data.inventory || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setMsg('');
      const res: any = await bloodBankService.updateInventory({
        bloodGroup: selectedGroup,
        unitsAvailable: Number(unitsAvailable),
        location,
      });

      if (res.success) {
        setMsg(`Stock updated for ${selectedGroup} to ${unitsAvailable} units with live timestamp.`);
        fetchInventory();
      }
    } catch (err: any) {
      setMsg(err.message || 'Inventory update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading blood bank inventory...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blood Bank Stock Inventory Management</h1>
        <p className="text-xs text-gray-500">Update unit stock levels across all 8 ABO/Rh blood groups.</p>
      </div>

      {/* Warning Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-900 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span>
          Every stock update automatically records an immutable timestamp. Do not imply inventory availability if data is stale.
        </span>
      </div>

      {msg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">{msg}</div>}

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs items-end">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Blood Group</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          >
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Units Available</label>
          <input
            type="number"
            min="0"
            required
            value={unitsAvailable}
            onChange={(e) => setUnitsAvailable(Number(e.target.value))}
            className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Storage Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={updating}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded inline-flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>{updating ? 'Updating...' : 'Update Stock'}</span>
          </button>
        </div>
      </form>

      {/* Inventory Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 font-semibold border-b border-gray-200 uppercase tracking-wider">
            <tr>
              <th className="p-3">Blood Group</th>
              <th className="p-3">Units Available</th>
              <th className="p-3">Status</th>
              <th className="p-3">Location</th>
              <th className="p-3">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 font-extrabold text-red-600 text-sm">{item.bloodGroup}</td>
                <td className="p-3 font-bold text-gray-900">{item.unitsAvailable} Units</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'LOW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{item.location}</td>
                <td className="p-3 text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  {new Date(item.lastUpdated).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

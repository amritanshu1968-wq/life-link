import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res: any = await adminService.getUsers();
      if (res.success) setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminService.updateUserStatus(userId, nextStatus);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading user list...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Account Management</h1>
        <p className="text-xs text-gray-500">Monitor platform accounts across all roles.</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 font-semibold border-b border-gray-200 uppercase">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">Email & Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                <td className="p-3 text-gray-500">{u.email} <br /><span className="text-[11px]">{u.phone}</span></td>
                <td className="p-3 font-semibold text-indigo-700">{u.role}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleStatus(u.id, u.status)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      u.status === 'ACTIVE'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

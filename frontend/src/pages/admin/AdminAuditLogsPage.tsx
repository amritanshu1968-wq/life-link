import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Clock } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminService.getAuditLogs()
      .then((res: any) => {
        if (res.success) setLogs(res.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading audit log trail...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">System Audit Trail</h1>
        <p className="text-xs text-gray-500">Immutable logging trail across all platform entity actions.</p>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 font-semibold border-b border-gray-200 uppercase">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-400 font-mono text-[11px]">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-3 font-semibold text-gray-900">{log.user?.name || 'System'}</td>
                <td className="p-3 font-bold text-red-600">{log.action}</td>
                <td className="p-3 text-gray-600 font-mono text-[11px]">{log.entityType} ({log.entityId.slice(0, 8)})</td>
                <td className="p-3 text-gray-700">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

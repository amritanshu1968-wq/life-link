import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { NotificationItem } from '../../types';
import { Bell, CheckCircle } from 'lucide-react';

export const DonorNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res: any = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8 text-xs text-gray-500">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Emergency & Account Notifications</h1>
        <p className="text-xs text-gray-500">Alerts sent regarding emergency requests and donation confirmations.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
          No notifications recorded.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border rounded-lg text-xs space-y-1 ${
                n.isRead ? 'bg-white border-gray-200' : 'bg-red-50/60 border-red-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Bell className="w-3.5 h-3.5 mr-1.5 text-red-600" />
                  {n.title}
                </h4>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-[11px] text-red-600 hover:underline flex items-center"
                  >
                    <CheckCircle className="w-3 h-3 mr-0.5" /> Mark read
                  </button>
                )}
              </div>
              <p className="text-gray-600">{n.message}</p>
              <span className="text-[10px] text-gray-400 block pt-1">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

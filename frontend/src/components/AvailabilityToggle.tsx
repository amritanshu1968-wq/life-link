import React, { useState } from 'react';
import { donorService } from '../services/donorService';

interface AvailabilityToggleProps {
  initialAvailable: boolean;
  onUpdate?: (newStatus: boolean) => void;
}

export const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({
  initialAvailable,
  onUpdate,
}) => {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      const nextStatus = !isAvailable;
      const res: any = await donorService.updateAvailability(nextStatus);
      if (res.success) {
        setIsAvailable(nextStatus);
        if (onUpdate) onUpdate(nextStatus);
      }
    } catch (err) {
      console.error('Failed to update availability:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div>
        <h4 className="text-sm font-semibold text-gray-900">Donation Availability</h4>
        <p className="text-xs text-gray-500">
          Status: {isAvailable ? <span className="text-emerald-600 font-semibold">Available</span> : <span className="text-gray-500">Unavailable</span>}
        </p>
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
          isAvailable
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        {loading ? 'Saving...' : isAvailable ? 'ON (Available)' : 'OFF (Unavailable)'}
      </button>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Droplet } from 'lucide-react';
import { requestService } from '../../services/requestService';
import { BloodRequest, BloodGroup } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';

interface FindBloodPageProps {
  isEmbedded?: boolean;
  title?: string;
  subtitle?: string;
}

export const FindBloodPage: React.FC<FindBloodPageProps> = ({
  isEmbedded = false,
  title = 'Find Emergency Blood Requests',
  subtitle = 'Search active blood requests across cities and blood groups.',
}) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res: any = await requestService.getRequests({
        bloodGroup: selectedGroup || undefined,
        city: selectedCity || undefined,
      });
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedGroup, selectedCity]);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className={isEmbedded ? "space-y-6" : "max-w-7xl mx-auto px-4 py-8 space-y-6"}>
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <MedicalDisclaimerAlert />

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px] gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Blood Group</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">City / Location</label>
          <input
            type="text"
            placeholder="e.g. Lucknow"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <button
            onClick={fetchRequests}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded inline-flex items-center justify-center space-x-1 h-9"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Requests</span>
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Searching active blood requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 rounded-lg text-center text-gray-500 text-sm">
          No active blood requests found matching your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-red-200 transition-colors flex flex-col h-full w-full justify-between space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold text-sm rounded">
                    {req.bloodGroup}
                  </span>
                  <StatusBadge urgency={req.urgency} />
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm">
                  {req.unitsRequired} Unit(s) Required
                </h4>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
                  {req.area}, {req.city} ({req.postalCode})
                </p>
                {req.hospital && (
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Hospital: {req.hospital.hospitalName}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs mt-auto">
                <span className="text-gray-400 truncate">
                  Required: {new Date(req.requiredDateTime).toLocaleDateString()}
                </span>
                <Link
                  to={`/blood-requests/${req.id}`}
                  className="font-semibold text-red-600 hover:underline flex-shrink-0"
                >
                  View Ticket & Respond →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

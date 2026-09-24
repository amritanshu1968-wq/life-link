import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { BloodGroup, Urgency } from '../../types';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { PlusCircle } from 'lucide-react';

export const CreateRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [urgency, setUrgency] = useState<Urgency>('NORMAL');
  const [city, setCity] = useState<string>('Lucknow');
  const [area, setArea] = useState<string>('Hazratganj');
  const [postalCode, setPostalCode] = useState<string>('226001');
  const [requiredDateTime, setRequiredDateTime] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [reason, setReason] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !area || !unitsRequired) {
      setError('Please fill in all required request fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res: any = await requestService.createRequest({
        bloodGroup,
        unitsRequired: Number(unitsRequired),
        urgency,
        city,
        area,
        postalCode,
        requiredDateTime,
        reason,
      });

      if (res.success && res.data) {
        navigate(`/requester/requests/${res.data.request.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create blood request.');
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Create Emergency Blood Request Ticket</h1>
        <p className="text-xs text-gray-500">Submit blood requirements to locate compatible nearby donors immediately.</p>
      </div>

      <MedicalDisclaimerAlert />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Blood Group Required</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Units Required</label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={unitsRequired}
              onChange={(e) => setUnitsRequired(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Urgency Level</label>
          <div className="grid grid-cols-3 gap-3">
            {(['NORMAL', 'URGENT', 'EMERGENCY'] as Urgency[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setUrgency(level)}
                className={`py-2 px-3 rounded text-xs font-semibold border ${
                  urgency === level
                    ? level === 'EMERGENCY'
                      ? 'bg-red-600 text-white border-red-600'
                      : level === 'URGENT'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-gray-800 text-white border-gray-800'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Area / Locality</label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Required Date & Time</label>
          <input
            type="datetime-local"
            required
            value={requiredDateTime}
            onChange={(e) => setRequiredDateTime(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Basic Request Details / Medical Reason</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Surgical procedure scheduled at Apex Super Speciality Hospital"
            className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors inline-flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Submitting & Initiating Matching...' : 'Submit Blood Request Ticket'}</span>
        </button>
      </form>
    </div>
  );
};

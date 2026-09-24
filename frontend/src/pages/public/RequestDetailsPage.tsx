import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { BloodRequest, ResponseStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responding, setResponding] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Post-acceptance withdrawal modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawReason, setWithdrawReason] = useState<string>('UNABLE_TO_TRAVEL');
  const [withdrawNote, setWithdrawNote] = useState<string>('');

  const fetchRequestDetails = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res: any = await requestService.getRequestById(id);
      if (res.success && res.data) {
        setRequest(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const handleRespond = async (status: 'ACCEPTED' | 'DECLINED') => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setResponding(true);
      setErrorMsg('');
      setSuccessMsg('');
      const res: any = await requestService.respondToRequest(id!, status, notes);
      if (res.success) {
        setSuccessMsg(`Response successfully recorded as ${status}.`);
        fetchRequestDetails();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record donor response.');
    } finally {
      setResponding(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !id) return;
    try {
      setResponding(true);
      setErrorMsg('');
      setSuccessMsg('');
      const res: any = await requestService.withdrawResponse(id, withdrawReason, withdrawNote);
      if (res.success) {
        setSuccessMsg('Your response has been withdrawn. The hospital has been notified.');
        setShowWithdrawModal(false);
        fetchRequestDetails();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to withdraw response.');
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-gray-500">Loading blood request details...</div>;
  }

  if (!request) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-red-600">Blood request ticket not found.</div>;
  }

  // Check if current donor has already accepted
  const userResponse = request.donorResponses?.find(
    (r) => r.donor?.userId === user?.id || (r as any).donorId === user?.id
  );
  const hasAccepted = userResponse?.responseStatus === 'ACCEPTED';
  const hasWithdrawn = userResponse?.responseStatus === 'WITHDRAWN';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2">
            {request.requestCode ? (
              <span className="text-xl font-extrabold text-red-600">{request.requestCode}</span>
            ) : (
              <span className="text-sm font-semibold text-gray-700">Public Request Ticket</span>
            )}
            <StatusBadge urgency={request.urgency} />
            <StatusBadge status={request.status} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Created on {new Date(request.createdAt).toLocaleString()}</p>
        </div>

        <div className="text-right">
          <span className="px-3 py-1.5 bg-red-100 text-red-800 font-extrabold text-lg rounded">
            {request.bloodGroup}
          </span>
          <p className="text-xs text-gray-700 font-semibold mt-1">{request.unitsRequired} Unit(s) Needed</p>
        </div>
      </div>

      <MedicalDisclaimerAlert />

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Ticket Info Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-2">Request Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-500 block">Location:</span>
            <span className="font-medium text-gray-900 flex items-center mt-0.5">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {request.area}, {request.city} ({request.postalCode})
            </span>
          </div>

          <div>
            <span className="text-gray-500 block">Required DateTime:</span>
            <span className="font-medium text-gray-900 flex items-center mt-0.5">
              <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
              {new Date(request.requiredDateTime).toLocaleString()}
            </span>
          </div>

          {request.hospital && (
            <div>
              <span className="text-gray-500 block">Coordinating Hospital:</span>
              <span className="font-semibold text-gray-900">{request.hospital.hospitalName}</span>
              <span className="text-gray-500 block text-[11px]">{request.hospital.address}</span>
            </div>
          )}

          <div>
            <span className="text-gray-500 block">Urgency Level:</span>
            <span className="font-bold text-gray-900"><StatusBadge urgency={request.urgency} /></span>
          </div>
        </div>
      </div>

      {/* Donor Action & Response Section */}
      {user && user.role === 'DONOR' && !['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(request.status) && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Your Response Status</h3>

          {hasAccepted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded space-y-3">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center text-emerald-800 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                  ✓ ACCEPTED — Response Received
                </span>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-semibold rounded"
                >
                  Unable to Donate / Decline
                </button>
              </div>
              <p className="text-xs text-emerald-900">
                Your acceptance has been communicated to the hospital. Please arrive at the hospital location by the required date and time.
              </p>
            </div>
          ) : hasWithdrawn ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded text-xs space-y-1">
              <span className="font-bold text-amber-900">Response Status: WITHDRAWN</span>
              <p className="text-amber-800">Reason: {userResponse?.withdrawalReason?.replace(/_/g, ' ')}</p>
              <p className="text-amber-700 text-[11px]">You previously accepted and subsequently withdrew your response.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                Confirm your availability to donate for this potentially compatible request.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add optional note (e.g., Can arrive at hospital in 30 mins)"
                className="w-full text-xs border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500 bg-white"
                rows={2}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRespond('ACCEPTED')}
                  disabled={responding}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded transition-colors"
                >
                  {responding ? 'Submitting...' : 'Accept Donation Request'}
                </button>
                <button
                  onClick={() => handleRespond('DECLINED')}
                  disabled={responding}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post-Acceptance Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Unable to Donate / Decline Confirmation</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <p className="text-gray-700">
              Are you sure you cannot proceed with this donation request? This will notify the hospital that you are no longer available.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Reason for Withdrawal</label>
              <select
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
              >
                <option value="UNABLE_TO_TRAVEL">Unable to travel</option>
                <option value="TOO_FAR_FROM_LOCATION">Too far from hospital location</option>
                <option value="PERSONAL_EMERGENCY">Personal emergency</option>
                <option value="ACCIDENT_OR_INCIDENT">Accident or unexpected incident</option>
                <option value="TRANSPORTATION_ISSUE">Transportation issue</option>
                <option value="NO_LONGER_AVAILABLE">No longer available</option>
                <option value="OTHER">Other reason</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Optional Note for Hospital</label>
              <textarea
                value={withdrawNote}
                onChange={(e) => setWithdrawNote(e.target.value)}
                placeholder="e.g. Stuck in traffic / emergency travel"
                className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={responding}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
              >
                {responding ? 'Processing...' : 'Confirm Decline / Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

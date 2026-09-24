import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [forecastResult, setForecastResult] = useState<any>({
    bloodGroup: 'O+',
    forecastPeriodDays: 7,
    estimatedDemandUnits: 14,
    confidenceScore: 0.89,
    disclaimer: 'AI demand estimates are for administrative resource planning only and do not replace clinical decisions.',
  });

  const [suspiciousRequests] = useState<any[]>([
    {
      id: 'REQ-9902',
      requesterName: 'Anon User',
      units: 45,
      frequency24h: 12,
      anomalyScore: 0.88,
      status: 'FLAGGED_FOR_HUMAN_REVIEW',
    },
  ]);

  const handleRunForecast = () => {
    // Simulated forecast response for selected blood group
    setForecastResult({
      bloodGroup: selectedGroup,
      forecastPeriodDays: 7,
      estimatedDemandUnits: selectedGroup.includes('O') ? 16 : selectedGroup.includes('A') ? 10 : 8,
      confidenceScore: 0.91,
      disclaimer: 'AI demand estimates are for administrative resource planning only and do not replace clinical decisions.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-red-600" />
          <h1 className="text-xl font-bold text-gray-900">AI Analytics & System Intelligence</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">Python FastAPI AI model reports for blood demand forecasting and anomaly flags.</p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-900 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <span>
          AI outputs are strictly informational flags for administrative review. AI models NEVER determine medical eligibility, compatibility, or auto-ban users.
        </span>
      </div>

      {/* Demand Forecasting Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h3 className="font-bold text-gray-900 text-sm flex items-center">
            <TrendingUp className="w-4 h-4 text-red-600 mr-1.5" />
            7-Day Blood Demand Forecasting Model
          </h3>
          <span className="text-gray-500 text-[11px]">Model Version: v1.4-fastapi</span>
        </div>

        <div className="flex items-end space-x-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Target Blood Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:ring-1 focus:ring-red-500 text-xs"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunForecast}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded"
          >
            Run Forecast Analysis
          </button>
        </div>

        {forecastResult && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2">
            <div className="flex justify-between text-gray-900 font-semibold">
              <span>Forecasted Units Needed ({forecastResult.bloodGroup}):</span>
              <span className="text-red-600 text-sm font-extrabold">{forecastResult.estimatedDemandUnits} Units</span>
            </div>
            <p className="text-gray-500 text-[11px]">Confidence Score: {(forecastResult.confidenceScore * 100).toFixed(0)}%</p>
            <p className="text-gray-600 text-[11px] italic">{forecastResult.disclaimer}</p>
          </div>
        )}
      </div>

      {/* Suspicious Requests Flagged Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-gray-900 text-sm flex items-center">
          <ShieldAlert className="w-4 h-4 text-amber-600 mr-1.5" />
          Suspicious Activity Flagged for Admin Review
        </h3>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 font-semibold border-b border-gray-200">
              <tr>
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Units Requested</th>
                <th className="p-3">24h Frequency</th>
                <th className="p-3">Anomaly Score</th>
                <th className="p-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suspiciousRequests.map((req) => (
                <tr key={req.id}>
                  <td className="p-3 font-semibold text-red-600">{req.id}</td>
                  <td className="p-3">{req.units} Units</td>
                  <td className="p-3 font-bold text-amber-700">{req.frequency24h} Requests</td>
                  <td className="p-3 font-semibold">{req.anomalyScore}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold rounded text-[11px]">
                      FLAGGED FOR HUMAN REVIEW
                    </span>
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

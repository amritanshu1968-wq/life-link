import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">About LIFE-LINK</h1>
      <p className="text-sm text-gray-700 leading-relaxed">
        LIFE-LINK is a dedicated blood emergency coordination platform engineered to eliminate latency in finding compatible blood donors and verified blood bank inventories during medical emergencies.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm text-xs text-gray-700">
        <h3 className="font-bold text-gray-900 text-sm">Core Engineering Commitments</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Direct Emergency Response:</strong> Real-world workflow matching requesters with compatible donors.</li>
          <li><strong>Concurrency Protection:</strong> Transaction-safe donor acceptances to prevent over-subscription.</li>
          <li><strong>Privacy & Security:</strong> Approximate geolocation matching without exposing raw donor addresses.</li>
          <li><strong>Auditability:</strong> Immutable audit logging across all system actions for healthcare regulatory accountability.</li>
        </ul>
      </div>
    </div>
  );
};

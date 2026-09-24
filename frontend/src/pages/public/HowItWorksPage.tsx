import React from 'react';
import { MedicalDisclaimerAlert } from '../../components/MedicalDisclaimerAlert';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">How LIFE-LINK Works</h1>
        <p className="text-sm text-gray-600 mt-1">
          Understand the end-to-end technical coordination between requesters, donors, hospitals, and blood banks.
        </p>
      </div>

      <MedicalDisclaimerAlert />

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="border-l-4 border-red-600 pl-4">
          <h3 className="font-bold text-gray-900 text-sm">1. Blood Group Compatibility Rules</h3>
          <p className="text-xs text-gray-600 mt-1">
            Matching is computed using standard ABO and Rh factor compatibility matrices. For example, O- donors are considered universal red cell donors, while AB+ recipients are universal recipients.
          </p>
        </div>

        <div className="border-l-4 border-red-600 pl-4">
          <h3 className="font-bold text-gray-900 text-sm">2. Geolocation Radius Filtering</h3>
          <p className="text-xs text-gray-600 mt-1">
            The system filters available donors by city, area, and approximate distance to minimize transit time during emergencies. Exact donor home coordinates are never publicly exposed.
          </p>
        </div>

        <div className="border-l-4 border-red-600 pl-4">
          <h3 className="font-bold text-gray-900 text-sm">3. Transaction-Safe Donor Responses</h3>
          <p className="text-xs text-gray-600 mt-1">
            When multiple donors respond to an emergency ticket concurrently, MySQL database transactions guarantee that donor quotas cannot be over-allocated.
          </p>
        </div>

        <div className="border-l-4 border-red-600 pl-4">
          <h3 className="font-bold text-gray-900 text-sm">4. Multi-Level Facility Verification</h3>
          <p className="text-xs text-gray-600 mt-1">
            Hospitals and blood banks undergo independent verification via our dedicated .NET audit service before receiving privileged capabilities.
          </p>
        </div>
      </div>
    </div>
  );
};

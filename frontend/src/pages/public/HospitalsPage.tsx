import React, { useState, useEffect } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { hospitalService } from '../../services/hospitalService';
import { VerificationBadge } from '../../components/VerificationBadge';

interface HospitalsPageProps {
  isEmbedded?: boolean;
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({ isEmbedded = false }) => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    hospitalService.getAllHospitals()
      .then((res: any) => {
        if (res.success) {
          setHospitals(res.data || []);
        }
      })
      .catch((err) => console.error('Failed to load hospitals:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-xs text-gray-500">Loading registered hospital network...</div>;
  }

  return (
    <div className={isEmbedded ? "space-y-6" : "max-w-7xl mx-auto px-4 py-8 space-y-6"}>
      <div>
        <h1 className="text-xl font-bold text-gray-900">Registered Medical Hospitals</h1>
        <p className="text-xs text-gray-500 mt-0.5">Verified healthcare facilities coordinating blood requests on LIFE-LINK.</p>
      </div>

      {hospitals.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 rounded-lg text-center text-sm text-gray-500">
          No registered hospitals currently listed.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hospitals.map((hosp) => (
            <div key={hosp.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <Building2 className="w-6 h-6 text-red-600" />
                <VerificationBadge status={hosp.status} entityName="HOSPITAL" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{hosp.name}</h3>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  {hosp.address}, {hosp.city} ({hosp.postalCode})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

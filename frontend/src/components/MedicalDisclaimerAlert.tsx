import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  text?: string;
}

export const MedicalDisclaimerAlert: React.FC<Props> = ({
  text = 'Potentially compatible based on your registered blood group. Final eligibility must be confirmed by medical professionals.',
}) => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-sm text-amber-900 flex items-start space-x-2.5 my-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-950">Medical Compatibility Disclaimer</p>
        <p className="text-amber-800 text-xs mt-0.5">{text}</p>
      </div>
    </div>
  );
};

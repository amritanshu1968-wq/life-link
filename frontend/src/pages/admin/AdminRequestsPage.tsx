import React from 'react';
import { FindBloodPage } from '../public/FindBloodPage';

export const AdminRequestsPage: React.FC = () => {
  return (
    <FindBloodPage
      isEmbedded={true}
      title="Blood Requests Monitor"
      subtitle="Global blood requests monitoring and emergency coordination queue."
    />
  );
};

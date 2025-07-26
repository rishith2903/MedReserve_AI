import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { MonitorHeart } from '@mui/icons-material';

const SystemHealth = () => {
  return (
    <PlaceholderPage
      title="System Health"
      description="Monitor system performance and health metrics. Admin access required."
      icon={MonitorHeart}
    />
  );
};

export default SystemHealth;

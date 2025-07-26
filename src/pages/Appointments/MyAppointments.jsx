import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { CalendarToday } from '@mui/icons-material';

const MyAppointments = () => {
  return (
    <PlaceholderPage
      title="My Appointments"
      description="View and manage your upcoming and past appointments."
      icon={CalendarToday}
    />
  );
};

export default MyAppointments;

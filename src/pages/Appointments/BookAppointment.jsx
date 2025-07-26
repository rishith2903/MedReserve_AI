import React from 'react';
import PlaceholderPage from '../PlaceholderPage';
import { CalendarToday } from '@mui/icons-material';

const BookAppointment = () => {
  return (
    <PlaceholderPage
      title="Book Appointment"
      description="Schedule your appointment with our qualified doctors. This feature is coming soon!"
      icon={CalendarToday}
    />
  );
};

export default BookAppointment;

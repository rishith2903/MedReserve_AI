import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { appointmentAPI } from '../../services/api';

const MyAppointments: React.FC = () => {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentAPI.getMyAppointments().then(res => res.data),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      {appointments.length > 0 ? (
        appointments.map((appointment: any) => (
          <Card key={appointment.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(appointment.appointmentDateTime).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Status: {appointment.status}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1" textAlign="center">
              No appointments found
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MyAppointments;

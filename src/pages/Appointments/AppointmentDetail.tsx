import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent } from '@mui/material';

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Appointment Details
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Appointment ID: {id}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={2}>
            Detailed appointment information will be displayed here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentDetail;

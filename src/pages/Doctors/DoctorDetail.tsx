import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { doctorAPI } from '../../services/api';

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: () => doctorAPI.getDoctorById(Number(id)).then(res => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Doctor not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dr. {doctor.firstName} {doctor.lastName}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {doctor.specialty}
          </Typography>
          <Typography variant="body1" paragraph>
            {doctor.biography || 'No biography available.'}
          </Typography>
          <Typography variant="h6" color="primary">
            ₹{doctor.consultationFee} - Consultation Fee
          </Typography>
          <Box mt={3}>
            <Button
              variant="contained"
              onClick={() => navigate(`/book-appointment/${doctor.id}`)}
            >
              Book Appointment
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorDetail;

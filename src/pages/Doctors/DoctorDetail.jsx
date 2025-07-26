import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Grid,
  Rating,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Star,
  School,
  Work,
} from '@mui/icons-material';

const DoctorDetail = () => {
  const { id } = useParams();

  // Mock doctor data
  const doctor = {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.8,
    reviews: 124,
    location: 'Building A, Floor 3',
    education: 'MBBS, MD - Cardiology',
    about: 'Dr. Rajesh Kumar is a highly experienced cardiologist with over 15 years of practice. He specializes in interventional cardiology and has performed numerous successful cardiac procedures.',
    services: ['Cardiac Catheterization', 'Echocardiography', 'Stress Testing', 'Pacemaker Implantation'],
    availability: 'Available Today',
    image: null,
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 150, height: 150, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                  src={doctor.image}
                >
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  {doctor.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  {doctor.specialty}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                  <Rating value={doctor.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {doctor.rating} ({doctor.reviews} reviews)
                  </Typography>
                </Box>
                <Chip
                  label={doctor.availability}
                  color="success"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalendarToday />}
                  fullWidth
                >
                  Book Appointment
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                About Dr. {doctor.name.split(' ')[1]}
              </Typography>
              <Typography variant="body1" paragraph>
                {doctor.about}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Professional Details
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Work sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {doctor.experience} years of experience
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <School sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {doctor.education}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {doctor.location}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Services Offered
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {doctor.services.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorDetail;

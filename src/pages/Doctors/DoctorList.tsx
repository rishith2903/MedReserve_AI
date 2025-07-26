import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Rating,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Search, LocationOn, Star, Schedule } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { doctorAPI, PagedResponse, Doctor } from '../../services/api';

const specialties = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Pulmonology',
  'Urology',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'General Medicine',
];

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Psychiatry',
    'Oncology',
    'Gynecology',
    'Ophthalmology',
    'ENT',
  ];

  const { data: doctorsResponse, isLoading } = useQuery({
    queryKey: ['doctors', searchTerm, selectedSpecialty],
    queryFn: () => {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSpecialty !== 'All Specialties') params.specialty = selectedSpecialty;
      return doctorAPI.getAllDoctors(params).then(res => res.data);
    },
  });

  // Extract doctors array from paginated response
  const doctors = doctorsResponse?.content || [];

  const handleBookAppointment = (doctorId: number) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  const handleViewProfile = (doctorId: number) => {
    navigate(`/doctors/${doctorId}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Find Doctors
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Search and book appointments with qualified medical professionals
      </Typography>

      {/* Search and Filter */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Specialty"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Doctor Cards */}
      <Grid container spacing={3}>
        {doctors.map((doctor: any) => (
          <Grid item xs={12} md={6} lg={4} key={doctor.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                  >
                    {doctor.firstName?.charAt(0) || 'D'}{doctor.lastName?.charAt(0) || 'R'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Dr. {doctor.firstName || 'Unknown'} {doctor.lastName || 'Doctor'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialty}
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Chip
                    label={doctor.specialty}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {doctor.subSpecialty && (
                    <Chip
                      label={doctor.subSpecialty}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  <Chip
                    label={doctor.consultationType}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Star sx={{ color: 'gold', mr: 0.5, fontSize: 20 }} />
                  <Rating
                    value={doctor.averageRating || 0}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({doctor.totalReviews || 0} reviews)
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Schedule sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {doctor.yearsOfExperience} years experience
                  </Typography>
                </Box>

                {doctor.clinicAddress && (
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOn sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {doctor.clinicAddress}
                    </Typography>
                  </Box>
                )}

                <Typography variant="h6" color="primary" fontWeight="bold">
                  ₹{doctor.consultationFee}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consultation Fee
                </Typography>

                {doctor.biography && (
                  <Typography variant="body2" mt={2} sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {doctor.biography}
                  </Typography>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  onClick={() => handleViewProfile(doctor.id)}
                >
                  View Profile
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleBookAppointment(doctor.id)}
                  disabled={!doctor.isAvailable}
                >
                  {doctor.isAvailable ? 'Book Appointment' : 'Unavailable'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {doctors.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No doctors found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DoctorList;

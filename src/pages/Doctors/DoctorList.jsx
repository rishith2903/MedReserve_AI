import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Star,
  CalendarToday,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { departments } from '../../data/departments';

const DoctorList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Mock doctors data
  const doctors = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      experience: 15,
      rating: 4.8,
      reviews: 124,
      location: 'Building A, Floor 3',
      availability: 'Available Today',
      image: null,
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      experience: 12,
      rating: 4.9,
      reviews: 98,
      location: 'Building A, Floor 3',
      availability: 'Available Tomorrow',
      image: null,
    },
    {
      id: 3,
      name: 'Dr. Robert Miller',
      specialty: 'Neurology',
      experience: 18,
      rating: 4.7,
      reviews: 156,
      location: 'Building B, Floor 2',
      availability: 'Available Today',
      image: null,
    },
    {
      id: 4,
      name: 'Dr. Lisa Anderson',
      specialty: 'Dermatology',
      experience: 10,
      rating: 4.6,
      reviews: 89,
      location: 'Building C, Floor 1',
      availability: 'Available Today',
      image: null,
    },
    {
      id: 5,
      name: 'Dr. James Taylor',
      specialty: 'Orthopedics',
      experience: 14,
      rating: 4.8,
      reviews: 112,
      location: 'Building A, Floor 2',
      availability: 'Available Tomorrow',
      image: null,
    },
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Find a Doctor
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Browse our qualified healthcare professionals
      </Typography>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
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
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Specialty</InputLabel>
            <Select
              value={selectedSpecialty}
              label="Specialty"
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <MenuItem value="">All Specialties</MenuItem>
              {specialties.map((specialty) => (
                <MenuItem key={specialty} value={specialty}>
                  {specialty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Doctors Grid */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(`/doctors/${doctor.id}`)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                    src={doctor.image}
                  >
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {doctor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialty}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={doctor.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {doctor.rating} ({doctor.reviews} reviews)
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {doctor.experience} years experience
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {doctor.location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={doctor.availability}
                    size="small"
                    color={doctor.availability.includes('Today') ? 'success' : 'warning'}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CalendarToday />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book-appointment/${doctor.id}`);
                    }}
                  >
                    Book
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredDoctors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No doctors found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter options
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DoctorList;

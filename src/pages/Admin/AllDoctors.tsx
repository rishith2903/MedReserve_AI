import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  LocalHospital,
  Email,
  Phone,
  Edit,
  Delete,
  Add,
  Star,
  Visibility,
  MonitorHeart,
  Psychology,
  Healing,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { doctorAPI } from '../../services/api';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  isAvailable: boolean;
  rating: number;
  totalPatients: number;
}

const AllDoctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    specialty: '',
    qualifications: '',
    licenseNumber: '',
    experience: '',
    consultationFee: '',
    password: ''
  });

  // Fetch real doctors data from API
  const { data: doctorsData, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorAPI.getAllDoctors,
  });

  const doctors: Doctor[] = (doctorsData?.content || []).map((doctor: any) => ({
    id: doctor.id,
    firstName: doctor.user.firstName,
    lastName: doctor.user.lastName,
    email: doctor.user.email,
    phoneNumber: doctor.user.phoneNumber || 'N/A',
    specialty: doctor.specialty,
    qualification: doctor.qualifications,
    experience: doctor.experience,
    consultationFee: parseFloat(doctor.consultationFee),
    isAvailable: true, // Default to available
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    totalPatients: Math.floor(Math.random() * 200) + 50, // Random patients 50-250
  }));

  const specialties = ['All', 'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Oncology', 'Gynecology', 'Ophthalmology', 'ENT', 'Endocrinology'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === 'All' || doctor.specialty === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'Cardiology': return <MonitorHeart />;
      case 'Neurology': return <Psychology />;
      case 'Dermatology': return <Healing />;
      default: return <LocalHospital />;
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'Cardiology': return '#f44336';
      case 'Neurology': return '#9c27b0';
      case 'Dermatology': return '#ff9800';
      case 'Orthopedics': return '#4caf50';
      case 'Pediatrics': return '#2196f3';
      default: return '#607d8b';
    }
  };

  const stats = [
    {
      title: 'Total Doctors',
      value: doctors.length.toString(),
      icon: <LocalHospital />,
      color: '#1976d2',
    },
    {
      title: 'Available Now',
      value: doctors.filter(d => d.isAvailable).length.toString(),
      icon: <MonitorHeart />,
      color: '#2e7d32',
    },
    {
      title: 'Specialties',
      value: new Set(doctors.map(d => d.specialty)).size.toString(),
      icon: <Healing />,
      color: '#ed6c02',
    },
    {
      title: 'Avg Rating',
      value: (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1),
      icon: <Star />,
      color: '#9c27b0',
    },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Error loading doctors data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Doctor Management
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage all doctors in the MedReserve system
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: stat.color }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search doctors..."
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
              <FormControl fullWidth>
                <InputLabel>Specialty Filter</InputLabel>
                <Select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  label="Specialty Filter"
                >
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<Add />}
                fullWidth
                onClick={() => setDialogOpen(true)}
              >
                Add Doctor
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Doctors Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Specialty</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: getSpecialtyColor(doctor.specialty) }}>
                          {getSpecialtyIcon(doctor.specialty)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {doctor.firstName} {doctor.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {doctor.qualification}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email fontSize="small" />
                          {doctor.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize="small" />
                          {doctor.phoneNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doctor.specialty}
                        sx={{ 
                          bgcolor: `${getSpecialtyColor(doctor.specialty)}20`,
                          color: getSpecialtyColor(doctor.specialty),
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {doctor.experience} years
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.totalPatients} patients
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        ₹{doctor.consultationFee}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Star sx={{ color: '#ffc107', fontSize: 16 }} />
                        <Typography variant="body2" fontWeight="bold">
                          {doctor.rating}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doctor.isAvailable ? 'Available' : 'Unavailable'}
                        color={doctor.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <Visibility />
                      </IconButton>
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Doctor Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={newDoctor.firstName}
                  onChange={(e) => setNewDoctor({...newDoctor, firstName: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newDoctor.lastName}
                  onChange={(e) => setNewDoctor({...newDoctor, lastName: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newDoctor.phoneNumber}
                  onChange={(e) => setNewDoctor({...newDoctor, phoneNumber: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={newDoctor.specialty}
                    label="Specialty"
                    onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                  >
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                    <MenuItem value="Oncology">Oncology</MenuItem>
                    <MenuItem value="Gynecology">Gynecology</MenuItem>
                    <MenuItem value="Ophthalmology">Ophthalmology</MenuItem>
                    <MenuItem value="ENT">ENT</MenuItem>
                    <MenuItem value="Endocrinology">Endocrinology</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Qualifications"
                  value={newDoctor.qualifications}
                  onChange={(e) => setNewDoctor({...newDoctor, qualifications: e.target.value})}
                  placeholder="e.g., MD, MBBS"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="License Number"
                  value={newDoctor.licenseNumber}
                  onChange={(e) => setNewDoctor({...newDoctor, licenseNumber: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience (years)"
                  type="number"
                  value={newDoctor.experience}
                  onChange={(e) => setNewDoctor({...newDoctor, experience: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Consultation Fee (₹)"
                  type="number"
                  value={newDoctor.consultationFee}
                  onChange={(e) => setNewDoctor({...newDoctor, consultationFee: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            setNewDoctor({firstName: '', lastName: '', email: '', phoneNumber: '', specialty: '', qualifications: '', licenseNumber: '', experience: '', consultationFee: '', password: ''});
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Implement API call to create doctor
              console.log('Creating doctor:', newDoctor);
              alert('Doctor creation functionality will be implemented with backend API');
              setDialogOpen(false);
              setNewDoctor({firstName: '', lastName: '', email: '', phoneNumber: '', specialty: '', qualifications: '', licenseNumber: '', experience: '', consultationFee: '', password: ''});
            }}
          >
            Create Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllDoctors;

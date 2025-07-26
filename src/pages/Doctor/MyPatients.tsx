import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Person,
  Email,
  Phone,
  Visibility,
  CalendarToday,
  MonitorHeart,
  LocalPharmacy,
  Description,
  Close,
} from '@mui/icons-material';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: string;
  lastVisit: string;
  nextAppointment?: string;
  condition: string;
  status: 'Active' | 'Inactive';
}

const MyPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data - replace with actual API call
  const patients: Patient[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'patient@medreserve.com',
      phoneNumber: '+91 9876543210',
      age: 35,
      gender: 'Male',
      lastVisit: '2024-07-20',
      nextAppointment: '2024-07-30',
      condition: 'Hypertension',
      status: 'Active',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phoneNumber: '+91 9876543211',
      age: 28,
      gender: 'Female',
      lastVisit: '2024-07-18',
      condition: 'Diabetes Type 2',
      status: 'Active',
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@email.com',
      phoneNumber: '+91 9876543212',
      age: 45,
      gender: 'Male',
      lastVisit: '2024-07-15',
      nextAppointment: '2024-08-01',
      condition: 'Arthritis',
      status: 'Active',
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length.toString(),
      icon: <Person />,
      color: '#1976d2',
    },
    {
      title: 'Active Patients',
      value: patients.filter(p => p.status === 'Active').length.toString(),
      icon: <MonitorHeart />,
      color: '#2e7d32',
    },
    {
      title: 'Appointments Today',
      value: '5',
      icon: <CalendarToday />,
      color: '#ed6c02',
    },
    {
      title: 'Follow-ups Due',
      value: patients.filter(p => p.nextAppointment).length.toString(),
      icon: <Description />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Patients
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage and view your patient information
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

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search patients by name or email..."
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
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Age/Gender</TableCell>
                  <TableCell>Last Visit</TableCell>
                  <TableCell>Next Appointment</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          {patient.firstName[0]}{patient.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {patient.firstName} {patient.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {patient.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email fontSize="small" />
                          {patient.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize="small" />
                          {patient.phoneNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {patient.age} years
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.gender}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {patient.nextAppointment ? (
                        <Typography variant="body2" color="primary">
                          {new Date(patient.nextAppointment).toLocaleDateString()}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not scheduled
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {patient.condition}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={patient.status}
                        color={patient.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewPatient(patient)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Patient Details - {selectedPatient?.firstName} {selectedPatient?.lastName}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Personal Information</Typography>
                <Typography variant="body2">Name: {selectedPatient.firstName} {selectedPatient.lastName}</Typography>
                <Typography variant="body2">Age: {selectedPatient.age} years</Typography>
                <Typography variant="body2">Gender: {selectedPatient.gender}</Typography>
                <Typography variant="body2">Email: {selectedPatient.email}</Typography>
                <Typography variant="body2">Phone: {selectedPatient.phoneNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>Medical Information</Typography>
                <Typography variant="body2">Condition: {selectedPatient.condition}</Typography>
                <Typography variant="body2">Status: {selectedPatient.status}</Typography>
                <Typography variant="body2">Last Visit: {new Date(selectedPatient.lastVisit).toLocaleDateString()}</Typography>
                {selectedPatient.nextAppointment && (
                  <Typography variant="body2">Next Appointment: {new Date(selectedPatient.nextAppointment).toLocaleDateString()}</Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained">View Full History</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPatients;

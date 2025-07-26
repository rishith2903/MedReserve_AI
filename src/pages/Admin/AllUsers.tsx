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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Person,
  Email,
  Phone,
  Edit,
  Delete,
  Add,
  LocalHospital,
  AdminPanelSettings,
  Visibility,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

const AllUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'PATIENT',
    password: ''
  });

  // Since /users endpoint doesn't exist, use realistic mock data based on our database
  const users: User[] = [
    // Patients (25 total)
    { id: 1, firstName: 'John', lastName: 'Smith', email: 'john.smith@email.com', phoneNumber: '+1234567890', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-15' },
    { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phoneNumber: '+1234567891', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-16' },
    { id: 3, firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@email.com', phoneNumber: '+1234567892', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-17' },
    { id: 4, firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@email.com', phoneNumber: '+1234567893', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-18' },
    { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.wilson@email.com', phoneNumber: '+1234567894', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-19' },
    { id: 6, firstName: 'Jessica', lastName: 'Miller', email: 'jessica.miller@email.com', phoneNumber: '+1234567895', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-20' },
    { id: 7, firstName: 'Christopher', lastName: 'Garcia', email: 'christopher.garcia@email.com', phoneNumber: '+1234567896', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-21' },
    { id: 8, firstName: 'Amanda', lastName: 'Martinez', email: 'amanda.martinez@email.com', phoneNumber: '+1234567897', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-22' },
    { id: 9, firstName: 'Matthew', lastName: 'Anderson', email: 'matthew.anderson@email.com', phoneNumber: '+1234567898', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-23' },
    { id: 10, firstName: 'Ashley', lastName: 'Taylor', email: 'ashley.taylor@email.com', phoneNumber: '+1234567899', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-24' },

    // Doctors (56 total - showing first 10)
    { id: 51, firstName: 'Dr. Rajesh', lastName: 'Kumar', email: 'rajesh.kumar@medreserve.com', phoneNumber: '+9876543210', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-01' },
    { id: 52, firstName: 'Dr. Priya', lastName: 'Sharma', email: 'priya.sharma@medreserve.com', phoneNumber: '+9876543211', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-02' },
    { id: 53, firstName: 'Dr. Robert', lastName: 'Miller', email: 'robert.miller@medreserve.com', phoneNumber: '+9876543212', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-03' },
    { id: 54, firstName: 'Dr. Lisa', lastName: 'Anderson', email: 'lisa.anderson@medreserve.com', phoneNumber: '+9876543213', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-04' },
    { id: 55, firstName: 'Dr. James', lastName: 'Taylor', email: 'james.taylor@medreserve.com', phoneNumber: '+9876543214', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-05' },
    { id: 56, firstName: 'Dr. Maria', lastName: 'Garcia', email: 'maria.garcia@medreserve.com', phoneNumber: '+9876543215', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-06' },
    { id: 57, firstName: 'Dr. Elena', lastName: 'Rodriguez', email: 'elena.rodriguez@medreserve.com', phoneNumber: '+9876543216', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-07' },
    { id: 58, firstName: 'Dr. Sunita', lastName: 'Rao', email: 'sunita.rao@medreserve.com', phoneNumber: '+9876543217', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-08' },
    { id: 59, firstName: 'Dr. Sophia', lastName: 'Williams', email: 'sophia.williams@medreserve.com', phoneNumber: '+9876543218', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-09' },
    { id: 60, firstName: 'Dr. Alexander', lastName: 'Kumar', email: 'alexander.kumar@medreserve.com', phoneNumber: '+9876543219', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-10' },

    // Admins (9 total)
    { id: 101, firstName: 'Master', lastName: 'Admin', email: 'masteradmin@medreserve.com', phoneNumber: '+1111111111', role: 'ADMIN', isActive: true, emailVerified: true, createdAt: '2024-01-01' },
    { id: 102, firstName: 'Sarah', lastName: 'Mitchell', email: 'admin1@medreserve.com', phoneNumber: '+1111111112', role: 'ADMIN', isActive: true, emailVerified: true, createdAt: '2024-01-02' },
    { id: 103, firstName: 'Mike', lastName: 'Johnson', email: 'admin2@medreserve.com', phoneNumber: '+1111111113', role: 'ADMIN', isActive: true, emailVerified: true, createdAt: '2024-01-03' },
    { id: 104, firstName: 'Jennifer', lastName: 'Adams', email: 'admin3@medreserve.com', phoneNumber: '+1111111114', role: 'ADMIN', isActive: true, emailVerified: true, createdAt: '2024-01-04' },
    { id: 105, firstName: 'Robert', lastName: 'Wilson', email: 'admin4@medreserve.com', phoneNumber: '+1111111115', role: 'ADMIN', isActive: true, emailVerified: true, createdAt: '2024-01-05' },

    // Demo accounts
    { id: 201, firstName: 'Demo', lastName: 'Patient', email: 'patient@medreserve.com', phoneNumber: '+1234567890', role: 'PATIENT', isActive: true, emailVerified: true, createdAt: '2024-01-01' },
    { id: 202, firstName: 'Demo', lastName: 'Doctor', email: 'doctor@medreserve.com', phoneNumber: '+9876543210', role: 'DOCTOR', isActive: true, emailVerified: true, createdAt: '2024-01-01' },
    { id: 203, firstName: 'Demo', lastName: 'Admin', email: 'admin@medreserve.com', phoneNumber: '+1111111111', role: 'ADMIN', isActive: true, emailVerified: true, createdAt: '2024-01-01' },
  ];

  const isLoading = false;
  const error = null;

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DOCTOR': return <LocalHospital />;
      case 'ADMIN': return <AdminPanelSettings />;
      default: return <Person />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DOCTOR': return 'primary';
      case 'ADMIN': return 'secondary';
      default: return 'default';
    }
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: <Person />,
      color: '#1976d2',
    },
    {
      title: 'Patients',
      value: users.filter(u => u.role === 'PATIENT').length.toString(),
      icon: <Person />,
      color: '#2e7d32',
    },
    {
      title: 'Doctors',
      value: users.filter(u => u.role === 'DOCTOR').length.toString(),
      icon: <LocalHospital />,
      color: '#ed6c02',
    },
    {
      title: 'Admins',
      value: users.filter(u => u.role === 'ADMIN').length.toString(),
      icon: <AdminPanelSettings />,
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
          Error loading users data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        User Management
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage all users in the MedReserve system
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
                placeholder="Search users..."
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
                <InputLabel>Role Filter</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role Filter"
                >
                  <MenuItem value="All">All Roles</MenuItem>
                  <MenuItem value="PATIENT">Patients</MenuItem>
                  <MenuItem value="DOCTOR">Doctors</MenuItem>
                  <MenuItem value="ADMIN">Admins</MenuItem>
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
                Add User
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          {user.firstName[0]}{user.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email fontSize="small" />
                          {user.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize="small" />
                          {user.phoneNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <br />
                        <Chip
                          label={user.emailVerified ? 'Verified' : 'Unverified'}
                          color={user.emailVerified ? 'info' : 'warning'}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
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

      {/* Add User Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newUser.role}
                    label="Role"
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <MenuItem value="PATIENT">Patient</MenuItem>
                    <MenuItem value="DOCTOR">Doctor</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false);
            setNewUser({firstName: '', lastName: '', email: '', phoneNumber: '', role: 'PATIENT', password: ''});
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // TODO: Implement API call to create user
              console.log('Creating user:', newUser);
              alert('User creation functionality will be implemented with backend API');
              setDialogOpen(false);
              setNewUser({firstName: '', lastName: '', email: '', phoneNumber: '', role: 'PATIENT', password: ''});
            }}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllUsers;

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
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Visibility,
  VisibilityOff,
  ContentCopy,
  Person,
  Email,
  Lock,
  AdminPanelSettings,
  LocalHospital,
  PersonOutline,
} from '@mui/icons-material';

interface UserCredential {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  accountType: 'Demo' | 'Regular';
}

const Credentials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const [selectedCredential, setSelectedCredential] = useState<UserCredential | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // All user credentials
  const credentials: UserCredential[] = [
    // Demo Accounts
    { id: 1, email: 'patient@medreserve.com', password: 'password123', firstName: 'Demo', lastName: 'Patient', role: 'PATIENT', accountType: 'Demo' },
    { id: 2, email: 'doctor@medreserve.com', password: 'password123', firstName: 'Demo', lastName: 'Doctor', role: 'DOCTOR', accountType: 'Demo' },
    { id: 3, email: 'demo@medreserve.com', password: 'password123', firstName: 'Demo', lastName: 'Admin', role: 'ADMIN', accountType: 'Demo' },
    
    // Patient Accounts
    { id: 4, email: 'patient1@medreserve.com', password: 'password123', firstName: 'John', lastName: 'Doe', role: 'PATIENT', accountType: 'Regular' },
    { id: 5, email: 'patient2@medreserve.com', password: 'password123', firstName: 'Sarah', lastName: 'Johnson', role: 'PATIENT', accountType: 'Regular' },
    { id: 6, email: 'patient3@medreserve.com', password: 'password123', firstName: 'Michael', lastName: 'Brown', role: 'PATIENT', accountType: 'Regular' },
    { id: 7, email: 'patient4@medreserve.com', password: 'password123', firstName: 'Emily', lastName: 'Davis', role: 'PATIENT', accountType: 'Regular' },
    { id: 8, email: 'patient5@medreserve.com', password: 'password123', firstName: 'David', lastName: 'Wilson', role: 'PATIENT', accountType: 'Regular' },
    
    // Doctor Accounts
    { id: 9, email: 'doctor1@medreserve.com', password: 'password123', firstName: 'Dr. Jane', lastName: 'Smith', role: 'DOCTOR', accountType: 'Regular' },
    { id: 10, email: 'doctor2@medreserve.com', password: 'password123', firstName: 'Dr. Robert', lastName: 'Miller', role: 'DOCTOR', accountType: 'Regular' },
    { id: 11, email: 'doctor3@medreserve.com', password: 'password123', firstName: 'Dr. Lisa', lastName: 'Anderson', role: 'DOCTOR', accountType: 'Regular' },
    { id: 12, email: 'doctor4@medreserve.com', password: 'password123', firstName: 'Dr. James', lastName: 'Taylor', role: 'DOCTOR', accountType: 'Regular' },
    { id: 13, email: 'doctor5@medreserve.com', password: 'password123', firstName: 'Dr. Maria', lastName: 'Garcia', role: 'DOCTOR', accountType: 'Regular' },
    
    // Admin Account
    { id: 14, email: 'admin@medreserve.com', password: 'password123', firstName: 'Admin', lastName: 'User', role: 'ADMIN', accountType: 'Regular' },
  ];

  const filteredCredentials = credentials.filter(cred =>
    cred.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cred.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PATIENT': return <PersonOutline color="primary" />;
      case 'DOCTOR': return <LocalHospital color="secondary" />;
      case 'ADMIN': return <AdminPanelSettings color="warning" />;
      default: return <Person />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'PATIENT': return 'primary';
      case 'DOCTOR': return 'secondary';
      case 'ADMIN': return 'warning';
      default: return 'default';
    }
  };

  const getAccountTypeColor = (type: string) => {
    return type === 'Demo' ? 'success' : 'info';
  };

  const handleViewDetails = (credential: UserCredential) => {
    setSelectedCredential(credential);
    setDialogOpen(true);
  };

  const demoAccounts = credentials.filter(c => c.accountType === 'Demo');
  const patientAccounts = credentials.filter(c => c.role === 'PATIENT' && c.accountType === 'Regular');
  const doctorAccounts = credentials.filter(c => c.role === 'DOCTOR' && c.accountType === 'Regular');
  const adminAccounts = credentials.filter(c => c.role === 'ADMIN' && c.accountType === 'Regular');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Credentials
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        View all user accounts and their credentials (Admin access only)
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <strong>Security Notice:</strong> This page contains sensitive information. 
        Access is restricted to system administrators only.
      </Alert>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search by email, name, or role..."
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

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PersonOutline color="primary" />
                <Box>
                  <Typography variant="h4">{patientAccounts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Patients</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <LocalHospital color="secondary" />
                <Box>
                  <Typography variant="h4">{doctorAccounts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Doctors</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AdminPanelSettings color="warning" />
                <Box>
                  <Typography variant="h4">{adminAccounts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Admins</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Person color="success" />
                <Box>
                  <Typography variant="h4">{demoAccounts.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Demo Accounts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Credentials Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All User Credentials
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCredentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getRoleIcon(credential.role)}
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {credential.firstName} {credential.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">{credential.email}</Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(credential.email)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontFamily="monospace">
                          {showPasswords[credential.id] ? credential.password : '••••••••'}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => togglePasswordVisibility(credential.id)}
                        >
                          {showPasswords[credential.id] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                        <IconButton size="small" onClick={() => copyToClipboard(credential.password)}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={credential.role} 
                        size="small" 
                        color={getRoleColor(credential.role) as any}
                        icon={getRoleIcon(credential.role)}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={credential.accountType} 
                        size="small" 
                        color={getAccountTypeColor(credential.accountType) as any}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewDetails(credential)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Credential Details</DialogTitle>
        {selectedCredential && (
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedCredential.firstName} {selectedCredential.lastName}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Email fontSize="small" />
                  <Typography variant="body2"><strong>Email:</strong> {selectedCredential.email}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Lock fontSize="small" />
                  <Typography variant="body2"><strong>Password:</strong> {selectedCredential.password}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {getRoleIcon(selectedCredential.role)}
                  <Typography variant="body2"><strong>Role:</strong> {selectedCredential.role}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1}>
                  <Person fontSize="small" />
                  <Typography variant="body2"><strong>Account Type:</strong> {selectedCredential.accountType}</Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Credentials;

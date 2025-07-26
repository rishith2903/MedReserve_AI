import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Cake,
  Wc,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Security,
  HealthAndSafety,
  MonitorHeart,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '+91 9876543210',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    address: '123 Health Street, Medical City, MC 12345',
    emergencyContact: '+91 9876543211',
    bloodGroup: 'O+',
  });

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DOCTOR': return 'primary';
      case 'ADMIN': return 'secondary';
      case 'MASTER_ADMIN': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your personal information and account settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      icon={<Person />}
                      label={user?.role?.name || 'Patient'}
                      color={getRoleColor(user?.role?.name || 'PATIENT') as any}
                      variant="filled"
                    />
                    <Chip
                      icon={<HealthAndSafety />}
                      label="Verified Account"
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Member since {new Date(user?.createdAt || '2024-01-01').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setIsEditing(!isEditing)}
                  color="primary"
                  size="large"
                >
                  <Edit />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {isEditing ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={editData.phoneNumber}
                      onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={editData.dateOfBirth}
                      onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      value={editData.gender}
                      onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                      SelectProps={{ native: true }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Group"
                      value={editData.bloodGroup}
                      onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Emergency Contact"
                      value={editData.emergencyContact}
                      onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Full Name"
                      secondary={`${user?.firstName} ${user?.lastName}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Address"
                      secondary={user?.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone Number"
                      secondary={editData.phoneNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Cake />
                    </ListItemIcon>
                    <ListItemText
                      primary="Age"
                      secondary={`${calculateAge(editData.dateOfBirth)} years old (Born: ${new Date(editData.dateOfBirth).toLocaleDateString()})`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Wc />
                    </ListItemIcon>
                    <ListItemText
                      primary="Gender"
                      secondary={editData.gender}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MonitorHeart />
                    </ListItemIcon>
                    <ListItemText
                      primary="Blood Group"
                      secondary={editData.bloodGroup}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={editData.address}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Security */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Account Security
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Status"
                    secondary="Active & Verified"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Verified"
                    secondary="✓ Verified"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Verified"
                    secondary="✓ Verified"
                  />
                </ListItem>
              </List>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Emergency Contact Number
              </Typography>
              <Typography variant="h6" color="error" gutterBottom>
                {editData.emergencyContact}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This number will be contacted in case of medical emergencies
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;

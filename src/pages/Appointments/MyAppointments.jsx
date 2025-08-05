import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Event,
  Person,
  AccessTime,
  LocationOn,
  Phone,
  Email,
  Cancel,
  Update,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentsAPI } from '../../services/api';

const MyAppointments = () => {
  const { user } = useAuth();
  const theme = useTheme();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDialog, setRescheduleDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [newDateTime, setNewDateTime] = useState(null);

  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2025-07-28',
      time: '10:00 AM',
      status: 'CONFIRMED',
      type: 'CONSULTATION',
      location: 'Room 201, Cardiology Wing',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@medreserve.com',
      notes: 'Regular checkup for heart condition'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      date: '2025-07-30',
      time: '2:30 PM',
      status: 'PENDING',
      type: 'FOLLOW_UP',
      location: 'Room 105, Dermatology Clinic',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@medreserve.com',
      notes: 'Follow-up for skin treatment'
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Rodriguez',
      specialty: 'Neurology',
      date: '2025-07-25',
      time: '9:15 AM',
      status: 'COMPLETED',
      type: 'CONSULTATION',
      location: 'Room 301, Neurology Department',
      phone: '+1 (555) 456-7890',
      email: 'emily.rodriguez@medreserve.com',
      notes: 'Consultation for headaches'
    }
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Call the API to get user's appointments
      const response = await appointmentsAPI.getAll();
      const appointmentsData = response.content || response.data || response;

      // Transform backend data to match frontend format if needed
      const transformedAppointments = Array.isArray(appointmentsData)
        ? appointmentsData.map(apt => ({
            id: apt.id,
            doctorName: apt.doctorName || `Dr. ${apt.doctor?.firstName} ${apt.doctor?.lastName}`,
            specialty: apt.doctor?.specialty || apt.specialty,
            date: new Date(apt.appointmentDateTime).toDateString(),
            time: new Date(apt.appointmentDateTime).toLocaleTimeString(),
            status: apt.status,
            type: apt.appointmentType || apt.type,
            location: apt.location || 'MedReserve Clinic',
            phone: apt.doctor?.phone || '+1 (555) 123-4567',
            email: apt.doctor?.email || 'doctor@medreserve.com',
            notes: apt.chiefComplaint || apt.notes
          }))
        : [];

      setAppointments(transformedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Using sample data.');

      // Fallback to mock data if API fails
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'COMPLETED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle />;
      case 'PENDING':
        return <Schedule />;
      case 'COMPLETED':
        return <CheckCircle />;
      case 'CANCELLED':
        return <Cancel />;
      default:
        return <Event />;
    }
  };

  const handleReschedule = async () => {
    if (!newDateTime || !selectedAppointment) return;

    try {
      // Call the API to reschedule appointment
      await appointmentsAPI.reschedule(selectedAppointment.id, newDateTime.toISOString());

      // Update local state
      setAppointments(prev => prev.map(apt =>
        apt.id === selectedAppointment.id
          ? { ...apt, date: newDateTime.toDateString(), time: newDateTime.toLocaleTimeString() }
          : apt
      ));

      setRescheduleDialog(false);
      setSelectedAppointment(null);
      setNewDateTime(null);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Reschedule error:', err);
      setError(err.response?.data?.message || 'Failed to reschedule appointment');
    }
  };

  const handleCancel = async () => {
    if (!selectedAppointment) return;

    try {
      // Call the API to cancel appointment
      await appointmentsAPI.cancel(selectedAppointment.id);

      // Update local state
      setAppointments(prev => prev.map(apt =>
        apt.id === selectedAppointment.id
          ? { ...apt, status: 'CANCELLED' }
          : apt
      ));

      setCancelDialog(false);
      setSelectedAppointment(null);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Cancel error:', err);
      setError(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          My Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your upcoming and past appointments
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Appointments List */}
      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} md={6} lg={4} key={appointment.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Status and Type */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(appointment.status)}
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {appointment.type}
                  </Typography>
                </Box>

                {/* Doctor Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {appointment.doctorName}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {appointment.specialty}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Appointment Details */}
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {appointment.date}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {appointment.time}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {appointment.location}
                    </Typography>
                  </Box>

                  {appointment.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                      "{appointment.notes}"
                    </Typography>
                  )}
                </Box>

                {/* Action Buttons */}
                {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                  <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Update />}
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setRescheduleDialog(true);
                      }}
                      sx={{ flex: 1 }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setCancelDialog(true);
                      }}
                      sx={{ flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {appointments.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Event sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Appointments Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You don't have any appointments scheduled yet.
          </Typography>
          <Button variant="contained" href="/doctors">
            Book Your First Appointment
          </Button>
        </Box>
      )}

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialog} onClose={() => setRescheduleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reschedule Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select a new date and time for your appointment with {selectedAppointment?.doctorName}.
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="New Date & Time"
              value={newDateTime}
              onChange={setNewDateTime}
              minDateTime={new Date()}
              enableAccessibleFieldDOMStructure={false}
              slots={{
                textField: TextField
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mt: 2 }
                }
              }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReschedule}
            variant="contained"
            disabled={!newDateTime}
          >
            Reschedule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your appointment with {selectedAppointment?.doctorName}
            on {selectedAppointment?.date} at {selectedAppointment?.time}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Keep Appointment</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAppointments;

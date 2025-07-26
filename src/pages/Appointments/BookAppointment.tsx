import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
// Removed date picker imports to fix compilation issues
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fixed appointment time slots
  const timeSlots = [
    // Morning slots: 10:00 AM - 1:00 PM
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
    // Evening slots: 3:00 PM - 7:00 PM
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  const [appointmentType, setAppointmentType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Fetch doctor details
  const { data: doctor, isLoading: doctorLoading } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => doctorAPI.getDoctorById(Number(doctorId!)).then(res => res.data),
    enabled: !!doctorId,
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: (appointmentData: any) => appointmentAPI.createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      navigate('/appointments', {
        state: { message: 'Appointment booked successfully!' }
      });
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to book appointment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedDate || !selectedTime || !appointmentType) {
      setError('Please fill in all required fields');
      return;
    }

    // Combine date and time
    const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}:00`);

    const appointmentData = {
      doctorId: Number(doctorId),
      appointmentDateTime: appointmentDateTime.toISOString(),
      appointmentType,
      symptoms: symptoms || undefined,
      notes: notes || undefined,
    };

    bookAppointmentMutation.mutate(appointmentData);
  };

  if (doctorLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box>
        <Alert severity="error">Doctor not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box>
        <Typography variant="h4" gutterBottom>
          Book Appointment
        </Typography>

        <Grid container spacing={3}>
          {/* Doctor Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ width: 64, height: 64, mr: 2 }}>
                    {doctor.firstName[0]}{doctor.lastName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialty}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" gutterBottom>
                  <strong>Experience:</strong> {doctor.yearsOfExperience} years
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Qualification:</strong> {doctor.qualification}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>License:</strong> {doctor.licenseNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
                </Typography>

                {doctor.averageRating && (
                  <Box mt={1}>
                    <Chip
                      label={`⭐ ${doctor.averageRating.toFixed(1)}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appointment Details
                </Typography>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Appointment Date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Appointment Time</InputLabel>
                        <Select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          label="Appointment Time"
                        >
                          {timeSlots.map((time) => (
                            <MenuItem key={time} value={time}>
                              {formatTimeSlot(time)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Appointment Type</InputLabel>
                        <Select
                          value={appointmentType}
                          onChange={(e) => setAppointmentType(e.target.value)}
                          label="Appointment Type"
                        >
                          <MenuItem value="CONSULTATION">Consultation</MenuItem>
                          <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                          <MenuItem value="EMERGENCY">Emergency</MenuItem>
                          <MenuItem value="ROUTINE_CHECKUP">Routine Checkup</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Symptoms (Optional)"
                        multiline
                        rows={3}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Describe your symptoms or reason for visit..."
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Additional Notes (Optional)"
                        multiline
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information for the doctor..."
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box display="flex" gap={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/doctors')}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={bookAppointmentMutation.isPending}
                          startIcon={bookAppointmentMutation.isPending && <CircularProgress size={20} />}
                        >
                          {bookAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BookAppointment;

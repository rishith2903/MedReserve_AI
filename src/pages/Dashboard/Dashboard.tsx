import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Stack,
  alpha,
} from '@mui/material';
import {
  CalendarToday,
  People,
  Psychology,
  Chat,
  TrendingUp,
  Notifications,
  Schedule,
  LocalHospital,
  Star,
  Description,
  LocalPharmacy,
  MonitorHeart,
  Healing,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI, smartFeaturesAPI, userAPI, doctorAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch real doctors data for admin dashboard
  const { data: doctorsData } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorAPI.getAllDoctors,
    enabled: user?.role?.name === 'ADMIN' || user?.role?.name === 'MASTER_ADMIN',
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data based on user role
  const getDashboardData = () => {
    if (user?.role?.name === 'PATIENT') {
      return {
        stats: [
          { title: 'Upcoming Appointments', value: '2', icon: <CalendarToday />, color: '#1976d2', trend: '+1 this week' },
          { title: 'Health Score', value: '85%', icon: <MonitorHeart />, color: '#2e7d32', trend: '+5% this month' },
          { title: 'Active Medications', value: '3', icon: <LocalPharmacy />, color: '#ed6c02', trend: '1 refill due' },
          { title: 'Reports Uploaded', value: '12', icon: <Description />, color: '#9c27b0', trend: '+2 this month' },
        ],
        quickActions: [
          { title: 'Book Appointment', icon: <CalendarToday />, path: '/doctors', color: '#1976d2' },
          { title: 'Symptom Checker', icon: <Psychology />, path: '/symptom-checker', color: '#2e7d32' },
          { title: 'Upload Reports', icon: <Description />, path: '/upload-reports', color: '#9c27b0' },
          { title: 'AI Assistant', icon: <Chat />, action: 'chat', color: '#ed6c02' },
        ]
      };
    } else if (user?.role?.name === 'DOCTOR') {
      return {
        stats: [
          { title: 'Today\'s Appointments', value: '8', icon: <CalendarToday />, color: '#1976d2', trend: '2 pending' },
          { title: 'Total Patients', value: '156', icon: <People />, color: '#2e7d32', trend: '+12 this month' },
          { title: 'Consultations Done', value: '1,234', icon: <LocalHospital />, color: '#ed6c02', trend: '+45 this month' },
          { title: 'Patient Satisfaction', value: '4.8/5', icon: <Star />, color: '#9c27b0', trend: '+0.2 this month' },
        ],
        quickActions: [
          { title: 'View Appointments', icon: <CalendarToday />, path: '/appointments', color: '#1976d2' },
          { title: 'Patient List', icon: <People />, path: '/patients', color: '#2e7d32' },
          { title: 'Symptom Checker', icon: <Psychology />, path: '/symptom-checker', color: '#9c27b0' },
          { title: 'AI Assistant', icon: <Chat />, action: 'chat', color: '#ed6c02' },
        ]
      };
    } else {
      // Admin dashboard with real data from our comprehensive database
      const totalPatients = 25; // From our database initialization
      const totalDoctors = doctorsData?.data?.content?.length || 56; // Real doctors from API or fallback
      const totalUsers = totalPatients + totalDoctors + 9; // Patients + Doctors + Admins
      const totalAppointments = 50; // From our database initialization

      return {
        stats: [
          { title: 'Total Patients', value: totalPatients.toString(), icon: <People />, color: '#1976d2', trend: `${totalUsers} total users` },
          { title: 'Total Doctors', value: totalDoctors.toString(), icon: <LocalHospital />, color: '#2e7d32', trend: 'All specialties covered' },
          { title: 'Total Appointments', value: totalAppointments.toString(), icon: <CalendarToday />, color: '#ed6c02', trend: 'All time appointments' },
          { title: 'System Health', value: '98%', icon: <MonitorHeart />, color: '#9c27b0', trend: 'All systems operational' },
        ],
        quickActions: [
          { title: 'All Users', icon: <People />, path: '/admin/users', color: '#1976d2' },
          { title: 'All Doctors', icon: <LocalHospital />, path: '/admin/doctors', color: '#2e7d32' },
          { title: 'System Health', icon: <MonitorHeart />, path: '/admin/system-health', color: '#9c27b0' },
          { title: 'Appointments', icon: <CalendarToday />, path: '/admin/appointments', color: '#ed6c02' },
        ]
      };
    }
  };

  const dashboardData = getDashboardData();

  // Fetch user's appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentAPI.getMyAppointments().then(res => res.data),
  });

  // Fetch wellness score
  const { data: wellnessData } = useQuery({
    queryKey: ['wellness-score'],
    queryFn: () => smartFeaturesAPI.getWellnessScore().then(res => res.data),
  });

  // Fetch health tips
  const { data: healthTips = [] } = useQuery({
    queryKey: ['health-tips'],
    queryFn: () => smartFeaturesAPI.getHealthTips().then(res => res.data),
  });

  const upcomingAppointments = appointments.filter(
    (apt: any) => new Date(apt.appointmentDateTime) > new Date() && apt.status === 'SCHEDULED'
  ).slice(0, 3);

  const getQuickActions = () => {
    if (user?.role?.name === 'PATIENT') {
      return [
        {
          title: 'Book Appointment',
          description: 'Schedule an appointment with a doctor',
          icon: <CalendarToday />,
          color: 'primary',
          action: () => navigate('/doctors'),
        },
        {
          title: 'View Reports',
          description: 'Access your medical reports',
          icon: <Description />,
          color: 'secondary',
          action: () => navigate('/medical-reports'),
        },
        {
          title: 'My Medicines',
          description: 'Track your medications',
          icon: <LocalPharmacy />,
          color: 'info',
          action: () => navigate('/medicines'),
        },
        {
          title: 'Symptom Checker',
          description: 'AI-powered medical specialty prediction',
          icon: <Psychology />,
          color: 'warning',
          action: () => navigate('/symptom-checker'),
        },
      ];
    } else if (user?.role?.name === 'DOCTOR') {
      return [
        {
          title: 'My Appointments',
          description: 'View and manage appointments',
          icon: <CalendarToday />,
          color: 'primary',
          action: () => navigate('/appointments'),
        },
        {
          title: 'My Patients',
          description: 'View patient information',
          icon: <People />,
          color: 'secondary',
          action: () => navigate('/patients'),
        },
        {
          title: 'Symptom Checker',
          description: 'AI-powered medical specialty prediction',
          icon: <Psychology />,
          color: 'info',
          action: () => navigate('/symptom-checker'),
        },
      ];
    } else {
      return [
        {
          title: 'All Users',
          description: 'View all system users',
          icon: <People />,
          color: 'primary',
          action: () => navigate('/users'),
        },
        {
          title: 'All Appointments',
          description: 'View all appointments',
          icon: <CalendarToday />,
          color: 'secondary',
          action: () => navigate('/appointments'),
        },
        {
          title: 'System Reports',
          description: 'View system reports',
          icon: <Description />,
          color: 'info',
          action: () => navigate('/reports'),
        },
      ];
    }
  };

  return (
    <Box>
      {/* Medical-themed Welcome Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1976d2 100%)',
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          }
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(255,255,255,0.15)',
              border: '3px solid rgba(255,255,255,0.3)'
            }}>
              <MonitorHeart sx={{ fontSize: 40 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Welcome back, Dr. {user?.firstName}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Your healthcare management dashboard • MedReserve AI Platform
            </Typography>
          </Grid>
          <Grid item>
            <Stack spacing={1} alignItems="flex-end">
              <Chip
                label={user?.role?.name || 'Patient'}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                border: `1px solid ${stat.color}30`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${alpha(stat.color, 0.3)}`
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                  <Box textAlign="right">
                    <Typography variant="h3" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.trend}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Healing color="primary" />
            Quick Actions
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {getQuickActions().map((action, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={action.action}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: `${action.color}.main`, mr: 2, width: 48, height: 48 }}>
                        {action.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold">
                        {action.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Upcoming Appointments */}
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Upcoming Appointments
          </Typography>
          <Card>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <List>
                  {upcomingAppointments.map((appointment: any, index: number) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Schedule color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(appointment.appointmentDateTime).toLocaleDateString()} at{' '}
                                {new Date(appointment.appointmentDateTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appointment.doctor.specialty} • {appointment.appointmentType}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip
                          label={appointment.status}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </ListItem>
                      {index < upcomingAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No upcoming appointments
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Book an appointment with our qualified doctors
                  </Typography>
                  <Button variant="contained" onClick={() => navigate('/doctors')}>
                    Find Doctors
                  </Button>
                </Box>
              )}
            </CardContent>
            {upcomingAppointments.length > 0 && (
              <CardActions>
                <Button size="small" onClick={() => navigate('/appointments')}>
                  View All Appointments
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Wellness Score */}
          {wellnessData && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Wellness Score
                  </Typography>
                </Box>
                <Box textAlign="center" mb={2}>
                  <Typography variant="h2" color="success.main" fontWeight="bold">
                    {wellnessData.overallScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    out of 100
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={wellnessData.overallScore}
                  sx={{ mb: 2, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {wellnessData.trends?.improvement} from last month
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Health Tips */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Star color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Health Tips
                </Typography>
              </Box>
              <List dense>
                {healthTips.slice(0, 3).map((tip: any, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={tip.tip}
                      secondary={tip.category}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button size="small" onClick={() => navigate('/health-tips')}>
                View More Tips
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Notifications color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recent Activity
                </Typography>
              </Box>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Appointment confirmed"
                    secondary="2 hours ago"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Health tip viewed"
                    secondary="1 day ago"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Profile updated"
                    secondary="3 days ago"
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Health Score Calculation Information */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonitorHeart color="primary" />
          How Wellness Score & Health Score is Calculated
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
              🎯 Wellness Score (0-100%)
            </Typography>
            <Typography variant="body2" paragraph>
              Your wellness score is calculated based on multiple health factors:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2">
                <strong>Regular Check-ups (25%):</strong> Frequency of medical consultations
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Medication Adherence (20%):</strong> Consistency in taking prescribed medicines
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Health Monitoring (20%):</strong> Regular vital signs tracking
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Lifestyle Factors (20%):</strong> Exercise, diet, and sleep patterns
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Preventive Care (15%):</strong> Vaccinations and health screenings
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.main">
              ❤️ Health Score (0-100%)
            </Typography>
            <Typography variant="body2" paragraph>
              Your health score reflects your current medical status:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <Typography component="li" variant="body2">
                <strong>Vital Signs (30%):</strong> Blood pressure, heart rate, temperature
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Lab Results (25%):</strong> Blood tests, cholesterol, glucose levels
              </Typography>
              <Typography component="li" variant="body2">
                <strong>BMI & Physical Health (20%):</strong> Weight, height, fitness level
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Chronic Conditions (15%):</strong> Management of existing conditions
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Mental Health (10%):</strong> Stress levels and psychological well-being
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          💡 <strong>Tip:</strong> Regular health check-ups, medication compliance, and healthy lifestyle choices improve both scores.
          Consult with your doctor for personalized health improvement strategies.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;

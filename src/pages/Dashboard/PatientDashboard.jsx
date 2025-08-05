import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Paper,
  LinearProgress,
  Skeleton,
  alpha,
} from '@mui/material';
import {
  LocalHospital,
  Schedule,
  Description,
  TrendingUp,
  Favorite,
  MonitorHeart,
  Thermostat,
  BloodtypeOutlined,
  Psychology,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { appointmentsAPI, doctorsAPI } from '../../services/api';
import realTimeDataService from '../../services/realTimeDataService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching dashboard metrics using real-time data service...');
      const metrics = await realTimeDataService.getDashboardMetrics('patient');

      // Set real-time metrics
      setHealthMetrics([
        {
          title: 'Upcoming Appointments',
          value: metrics.upcomingAppointments.toString(),
          icon: <Schedule />,
          color: '#2196f3',
          change: metrics.upcomingAppointments > 0 ? `${metrics.upcomingAppointments} scheduled` : 'No upcoming appointments',
          changeType: 'info'
        },
        {
          title: 'Available Doctors',
          value: metrics.availableDoctors.toString(),
          icon: <Person />,
          color: '#4caf50',
          change: `${metrics.availableDoctors} of ${metrics.totalDoctors} available`,
          changeType: 'positive'
        },
        {
          title: 'Total Appointments',
          value: metrics.totalAppointments.toString(),
          icon: <Description />,
          color: '#ff9800',
          change: 'All time appointments',
          changeType: 'positive'
        },
        {
          title: 'Health Score',
          value: '85%', // This would come from a health metrics API
          icon: <TrendingUp />,
          color: '#9c27b0',
          change: '+5% from last month',
          changeType: 'positive'
        }
      ]);

      console.log('✅ Successfully loaded dashboard metrics');

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');

      // Fallback to demo data
      setHealthMetrics([
        {
          title: 'Upcoming Appointments',
          value: '2',
          icon: <Schedule />,
          color: '#2196f3',
          change: 'Next: Tomorrow 2:00 PM',
          changeType: 'info'
        },
        {
          title: 'Medical Reports',
          value: '5',
          icon: <Description />,
          color: '#4caf50',
          change: 'Last updated: 2 days ago',
          changeType: 'positive'
        },
        {
          title: 'Active Medications',
          value: '3',
          icon: <LocalHospital />,
          color: '#ff9800',
          change: '1 due for refill',
          changeType: 'warning'
        },
        {
          title: 'Health Score',
          value: '85%',
          icon: <TrendingUp />,
          color: '#9c27b0',
          change: '+5% from last month',
          changeType: 'positive'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const vitalsData = [
    { label: 'Heart Rate', value: '72 bpm', icon: <Favorite />, color: '#e91e63' },
    { label: 'Blood Pressure', value: '120/80', icon: <MonitorHeart />, color: '#2196f3' },
    { label: 'Temperature', value: '98.6°F', icon: <Thermostat />, color: '#ff9800' },
    { label: 'Blood Type', value: 'O+', icon: <BloodtypeOutlined />, color: '#4caf50' },
  ];

  const quickActions = [
    {
      title: 'Find Doctors',
      description: 'Search and book appointments',
      icon: <Person />,
      color: '#2196f3',
      action: () => navigate('/doctors')
    },
    {
      title: 'AI Symptom Checker',
      description: 'Check your symptoms with AI',
      icon: <Psychology />,
      color: '#9c27b0',
      action: () => navigate('/symptom-checker')
    },
    {
      title: 'Upload Reports',
      description: 'Upload medical documents',
      icon: <Description />,
      color: '#4caf50',
      action: () => navigate('/upload-reports')
    },
    {
      title: 'Book Appointment',
      description: 'Schedule with your doctor',
      icon: <CalendarToday />,
      color: '#ff9800',
      action: () => navigate('/doctors')
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      {/* Welcome Section */}
      <Box sx={{
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.firstName || 'Patient'}! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Your health journey continues here
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
      </Box>

      {/* Health Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {healthMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}25 100%)`,
              border: `1px solid ${metric.color}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${metric.color}40`,
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{
                    bgcolor: metric.color,
                    mr: 2,
                    width: 48,
                    height: 48
                  }}>
                    {metric.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color }}>
                      {loading ? <Skeleton width={60} /> : metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={metric.change}
                  size="small"
                  sx={{
                    bgcolor: metric.changeType === 'positive' ? '#4caf5020' :
                             metric.changeType === 'warning' ? '#ff980020' : '#2196f320',
                    color: metric.changeType === 'positive' ? '#4caf50' :
                           metric.changeType === 'warning' ? '#ff9800' : '#2196f3',
                    fontWeight: 600,
                    border: 'none'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions and Vitals */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${action.color}20`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 15px ${action.color}30`,
                          bgcolor: `${action.color}05`
                        }
                      }}
                      onClick={action.action}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: action.color, mr: 2, width: 40, height: 40 }}>
                          {action.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {action.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Vitals */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Latest Vitals
              </Typography>
              <Grid container spacing={2}>
                {vitalsData.map((vital, index) => (
                  <Grid item xs={6} key={index}>
                    <Paper sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: alpha(vital.color, 0.1),
                      border: `1px solid ${alpha(vital.color, 0.2)}`
                    }}>
                      <Avatar sx={{
                        bgcolor: vital.color,
                        mx: 'auto',
                        mb: 1,
                        width: 32,
                        height: 32
                      }}>
                        {vital.icon}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: vital.color }}>
                        {loading ? <Skeleton width={40} /> : vital.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {vital.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;

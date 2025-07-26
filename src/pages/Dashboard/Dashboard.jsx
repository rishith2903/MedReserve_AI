import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  CalendarToday,
  LocalHospital,
  TrendingUp,
  Notifications,
  HealthAndSafety,
  Psychology,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment',
      icon: <CalendarToday />,
      color: 'primary',
      path: '/doctors'
    },
    {
      title: 'View Doctors',
      description: 'Browse available doctors',
      icon: <People />,
      color: 'secondary',
      path: '/doctors'
    },
    {
      title: 'Medical Reports',
      description: 'View your medical history',
      icon: <HealthAndSafety />,
      color: 'success',
      path: '/medical-reports'
    },
    {
      title: 'AI Health Assistant',
      description: 'Get AI-powered health insights',
      icon: <Psychology />,
      color: 'info',
      path: '/chatbot'
    }
  ];

  const stats = [
    {
      title: 'Total Appointments',
      value: '12',
      change: '+2 this month',
      color: 'primary'
    },
    {
      title: 'Upcoming Visits',
      value: '3',
      change: 'Next: Tomorrow',
      color: 'warning'
    },
    {
      title: 'Health Score',
      value: '85%',
      change: '+5% improved',
      color: 'success'
    },
    {
      title: 'Reports Uploaded',
      value: '8',
      change: '2 pending review',
      color: 'info'
    }
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome back, {user?.firstName || 'User'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your health dashboard overview
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}.main`, mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  color={stat.color}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Quick Actions
          </Typography>
        </Grid>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${action.color}.main`, 
                    mx: 'auto', 
                    mb: 2,
                    width: 56,
                    height: 56
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  { text: 'Appointment with Dr. Smith completed', time: '2 hours ago', type: 'success' },
                  { text: 'Lab results uploaded', time: '1 day ago', type: 'info' },
                  { text: 'Prescription refill requested', time: '3 days ago', type: 'warning' },
                  { text: 'Health checkup scheduled', time: '1 week ago', type: 'primary' }
                ].map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: `${activity.type}.main`, mr: 2, width: 32, height: 32 }}>
                      <Notifications sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">{activity.text}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Health Goals
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  { goal: 'Daily Steps', progress: 75, target: '10,000 steps' },
                  { goal: 'Water Intake', progress: 60, target: '8 glasses' },
                  { goal: 'Sleep Hours', progress: 85, target: '8 hours' }
                ].map((goal, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{goal.goal}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {goal.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={goal.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Target: {goal.target}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

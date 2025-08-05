import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Get user role
  const userRole = user?.role?.name || user?.role;

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'PATIENT':
      return <PatientDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'ADMIN':
    case 'MASTER_ADMIN':
      return <AdminDashboard />;
    default:
      // Fallback to patient dashboard for unknown roles
      return <PatientDashboard />;
  }
};

export default Dashboard;

  const healthMetrics = [
    {
      title: 'Total Appointments',
      value: '12',
      change: '+2 this month',
      changeType: 'positive',
      icon: <CalendarToday />,
      color: '#667eea'
    },
    {
      title: 'Upcoming Visits',
      value: '3',
      change: 'Next: Tomorrow',
      changeType: 'neutral',
      icon: <Schedule />,
      color: '#f093fb'
    },
    {
      title: 'Health Score',
      value: '85%',
      change: '+5% improved',
      changeType: 'positive',
      icon: <Favorite />,
      color: '#4facfe'
    },
    {
      title: 'Reports Uploaded',
      value: '8',
      change: '2 pending review',
      changeType: 'warning',
      icon: <Assessment />,
      color: '#43e97b'
    }
  ];

  const vitalsData = [
    {
      label: 'Heart Rate',
      value: loading ? '...' : `${healthData.heartRate} bpm`,
      icon: <MonitorHeart />,
      color: '#e74c3c',
      status: 'normal'
    },
    {
      label: 'Blood Pressure',
      value: loading ? '...' : healthData.bloodPressure,
      icon: <BloodtypeOutlined />,
      color: '#3498db',
      status: 'normal'
    },
    {
      label: 'Temperature',
      value: loading ? '...' : `${healthData.temperature}°F`,
      icon: <Thermostat />,
      color: '#f39c12',
      status: 'normal'
    },
    {
      label: 'Oxygen Level',
      value: loading ? '...' : `${healthData.oxygenLevel}%`,
      icon: <Favorite />,
      color: '#27ae60',
      status: 'normal'
    }
  ];

  const recentActivities = [
    {
      text: 'Appointment with Dr. Smith completed',
      time: '2 hours ago',
      type: 'success',
      icon: <CheckCircle />
    },
    {
      text: 'Lab results uploaded successfully',
      time: '1 day ago',
      type: 'info',
      icon: <Info />
    },
    {
      text: 'Prescription refill reminder',
      time: '3 days ago',
      type: 'warning',
      icon: <Warning />
    },
    {
      text: 'Health checkup scheduled for next week',
      time: '1 week ago',
      type: 'primary',
      icon: <Schedule />
    }
  ];

  const healthGoals = [
    {
      goal: 'Daily Steps',
      progress: 75,
      target: '10,000 steps',
      current: '7,500',
      icon: <DirectionsWalk />,
      color: '#667eea'
    },
    {
      goal: 'Water Intake',
      progress: 60,
      target: '8 glasses',
      current: '4.8',
      icon: <WaterDrop />,
      color: '#4facfe'
    },
    {
      goal: 'Sleep Hours',
      progress: 85,
      target: '8 hours',
      current: '6.8',
      icon: <Bedtime />,
      color: '#43e97b'
    }
  ];

  return (
    <Box sx={{
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      minHeight: '100vh',
      pb: 4,
      '@keyframes pulse': {
        '0%': {
          opacity: 1,
        },
        '50%': {
          opacity: 0.7,
        },
        '100%': {
          opacity: 1,
        },
      },
    }}>
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
            Welcome back, {user?.firstName || 'User'}! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Here's your personalized health dashboard overview
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
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
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

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  background: action.gradient,
                  color: 'white',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.1)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover::before': {
                    opacity: 1,
                  }
                }}
                onClick={() => navigate(action.path)}
              >
                <CardContent sx={{
                  textAlign: 'center',
                  py: 3,
                  position: 'relative',
                  zIndex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      mx: 'auto',
                      mb: 2,
                      width: 56,
                      height: 56,
                      color: 'white'
                    }}
                  >
                    {action.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>
                    {action.description}
                  </Typography>
                  <IconButton
                    sx={{
                      color: 'white',
                      mt: 1,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.2)',
                      }
                    }}
                  >
                    <ArrowForward />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Recent Activity
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: index < recentActivities.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Avatar sx={{
                        bgcolor: `${activity.type}.main`,
                        width: 40,
                        height: 40,
                        boxShadow: `0 4px 12px ${alpha(theme.palette[activity.type].main, 0.3)}`
                      }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {activity.text}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Goals & Vitals */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Health Goals */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Health Goals
                    </Typography>
                    <IconButton size="small">
                      <Timeline />
                    </IconButton>
                  </Box>
                  <Box>
                    {healthGoals.map((goal, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Avatar sx={{
                            bgcolor: goal.color,
                            width: 32,
                            height: 32,
                            mr: 2
                          }}>
                            {goal.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {goal.goal}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: goal.color }}>
                                {goal.progress}%
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                              {goal.current} of {goal.target}
                            </Typography>
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={goal.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha(goal.color, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: goal.color,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Vital Signs */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Vital Signs
                    </Typography>
                    <Chip
                      label="Live"
                      size="small"
                      sx={{
                        bgcolor: '#4caf50',
                        color: 'white',
                        fontWeight: 600,
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  </Box>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

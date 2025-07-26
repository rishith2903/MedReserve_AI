import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import {
  MonitorHeart,
  Storage,
  Memory,
  Speed,
  CloudQueue,
  Security,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  TrendingUp,
  Computer,
  NetworkCheck,
  Api,
} from '@mui/icons-material';

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  unit: string;
  icon: React.ReactNode;
}

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastCheck: string;
  responseTime: number;
}

const SystemHealth: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 45,
      status: 'healthy',
      unit: '%',
      icon: <Speed />,
    },
    {
      name: 'Memory Usage',
      value: 68,
      status: 'warning',
      unit: '%',
      icon: <Memory />,
    },
    {
      name: 'Disk Usage',
      value: 32,
      status: 'healthy',
      unit: '%',
      icon: <Storage />,
    },
    {
      name: 'Network I/O',
      value: 23,
      status: 'healthy',
      unit: 'MB/s',
      icon: <NetworkCheck />,
    },
  ];

  const services: ServiceStatus[] = [
    {
      name: 'Backend API',
      status: 'online',
      uptime: '99.9%',
      lastCheck: '2 minutes ago',
      responseTime: 120,
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      lastCheck: '1 minute ago',
      responseTime: 45,
    },
    {
      name: 'ML Service',
      status: 'online',
      uptime: '98.5%',
      lastCheck: '3 minutes ago',
      responseTime: 890,
    },
    {
      name: 'Chatbot Service',
      status: 'online',
      uptime: '99.2%',
      lastCheck: '2 minutes ago',
      responseTime: 340,
    },
    {
      name: 'File Storage',
      status: 'degraded',
      uptime: '97.1%',
      lastCheck: '5 minutes ago',
      responseTime: 1200,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'success';
      case 'warning':
      case 'degraded':
        return 'warning';
      case 'critical':
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle color="success" />;
      case 'warning':
      case 'degraded':
        return <Warning color="warning" />;
      case 'critical':
      case 'offline':
        return <Error color="error" />;
      default:
        return <CheckCircle />;
    }
  };

  const getMetricColor = (value: number, status: string) => {
    switch (status) {
      case 'healthy': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#2196f3';
    }
  };

  const overallHealth = services.filter(s => s.status === 'online').length / services.length * 100;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            System Health Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time monitoring of MedReserve system components
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => setLastUpdated(new Date())}
        >
          Refresh
        </Button>
      </Box>

      {/* Overall Health Status */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <MonitorHeart sx={{ fontSize: 32 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {overallHealth.toFixed(1)}%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Overall System Health
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              label={overallHealth > 95 ? 'Excellent' : overallHealth > 85 ? 'Good' : 'Needs Attention'}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* System Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {systemMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Avatar sx={{ bgcolor: getMetricColor(metric.value, metric.status) }}>
                    {metric.icon}
                  </Avatar>
                  <Chip
                    label={metric.status}
                    color={getStatusColor(metric.status) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {metric.name}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={getMetricColor(metric.value, metric.status)}>
                  {metric.value}{metric.unit}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  sx={{
                    mt: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getMetricColor(metric.value, metric.status),
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Services Status */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Api />
            Service Status
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uptime</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Last Check</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        {getStatusIcon(service.status)}
                        <Typography variant="subtitle2" fontWeight="bold">
                          {service.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.status.toUpperCase()}
                        color={getStatusColor(service.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {service.uptime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color={service.responseTime > 1000 ? 'error' : service.responseTime > 500 ? 'warning' : 'success'}
                        fontWeight="bold"
                      >
                        {service.responseTime}ms
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {service.lastCheck}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <Refresh />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemHealth;

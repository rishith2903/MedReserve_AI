import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  Fab,
  Container,
} from '@mui/material';
import {
  Dashboard,
  People,
  CalendarToday,
  Psychology,
  Chat,
  Person,
  HealthAndSafety,
  LocalHospital,
  Logout,
  Notifications,
  Description,
  Medication,
  Menu as MenuIcon,
  CloudUpload,
  MonitorHeart,
  Security,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { useAutoLogout } from '../../hooks/useAutoLogout';

const TopNavLayout = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto logout hook
  useAutoLogout();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  // Role-based navigation items
  const getNavigationItems = () => {
    const userRole = user?.role?.name || user?.role;

    // Common items for all authenticated users
    const commonItems = [
      { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    ];

    // Patient-specific navigation
    if (userRole === 'PATIENT') {
      return [
        ...commonItems,
        { label: 'Find Doctors', path: '/doctors', icon: <People /> },
        { label: 'My Appointments', path: '/appointments', icon: <CalendarToday /> },
        { label: 'Medical Reports', path: '/medical-reports', icon: <Description /> },
        { label: 'My Medicines', path: '/medicines', icon: <Medication /> },
        { label: 'Upload Reports', path: '/upload-reports', icon: <CloudUpload /> },
        { label: 'AI Symptom Checker', path: '/symptom-checker', icon: <Psychology /> },
        { label: 'AI Chatbot', path: '/chatbot', icon: <Chat /> },
        { label: 'Health Tips', path: '/health-tips', icon: <HealthAndSafety /> },
        { label: 'Emergency', path: '/emergency', icon: <LocalHospital /> },
      ];
    }

    // Doctor-specific navigation
    if (userRole === 'DOCTOR') {
      return [
        ...commonItems,
        { label: 'My Patients', path: '/patients', icon: <People /> },
        { label: 'My Schedule', path: '/appointments', icon: <CalendarToday /> },
        { label: 'Patient Reports', path: '/medical-reports', icon: <Description /> },
        { label: 'AI Tools', path: '/symptom-checker', icon: <Psychology /> },
        { label: 'Chat with Patients', path: '/chatbot', icon: <Chat /> },
        { label: 'My Profile', path: '/profile', icon: <Person /> },
      ];
    }

    // Admin-specific navigation
    if (userRole === 'ADMIN' || userRole === 'MASTER_ADMIN') {
      return [
        ...commonItems,
        { label: 'All Users', path: '/admin/users', icon: <People /> },
        { label: 'All Doctors', path: '/admin/doctors', icon: <People /> },
        { label: 'System Health', path: '/admin/system-health', icon: <MonitorHeart /> },
        { label: 'Appointments', path: '/admin/appointments', icon: <CalendarToday /> },
        { label: 'Credentials', path: '/admin/credentials', icon: <Security /> },
        { label: 'Reports', path: '/medical-reports', icon: <Description /> },
      ];
    }

    // Default fallback
    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <LocalHospital sx={{ mr: 2, color: 'white' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              MedReserve AI
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navigationItems.slice(0, 6).map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {item.icon}
                  <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', lg: 'block' } }}>
                    {item.label}
                  </Typography>
                </Button>
              ))}
            </Box>
          )}

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            {/* Notifications */}
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton color="inherit" onClick={() => setMobileMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            {/* Profile Avatar */}
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 1 }}>
              <Avatar
                alt={user?.firstName || 'User'}
                src={user?.profilePicture}
                sx={{ width: 40, height: 40 }}
              >
                {user?.firstName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <Person sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
      >
        <MenuItem>
          <Typography variant="body2">No new notifications</Typography>
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      {/* Mobile Chat Fab */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => navigate('/chatbot')}
        >
          <Chat />
        </Fab>
      )}
    </Box>
  );
};

export default TopNavLayout;

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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
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
  Close,
  CloudUpload,
  MonitorHeart,
  Security,
  DarkMode,
  LightMode,
  Email,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { useAutoLogout } from '../../hooks/useAutoLogout';

const getMenuItems = (userRole: string) => {
  if (userRole === 'PATIENT') {
    return [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Book Appointment', icon: <CalendarToday />, path: '/doctors' },
      { text: 'Symptoms', icon: <Psychology />, path: '/symptom-checker' },
      { text: 'Reports', icon: <Description />, path: '/medical-reports' },
      { text: 'Upload Reports', icon: <CloudUpload />, path: '/upload-reports' },
      { text: 'Medicines', icon: <Medication />, path: '/medicines' },
    ];
  } else if (userRole === 'DOCTOR') {
    return [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Appointments', icon: <CalendarToday />, path: '/appointments' },
      { text: 'Patients', icon: <People />, path: '/patients' },
      { text: 'Symptoms', icon: <Psychology />, path: '/symptom-checker' },
    ];
  } else if (userRole === 'ADMIN') {
    return [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'All Users', icon: <People />, path: '/admin/users' },
      { text: 'All Doctors', icon: <LocalHospital />, path: '/admin/doctors' },
      { text: 'System Health', icon: <MonitorHeart />, path: '/admin/system-health' },
      { text: 'Appointments', icon: <CalendarToday />, path: '/admin/appointments' },
    ];
  } else if (userRole === 'MASTER_ADMIN') {
    return [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'All Users', icon: <People />, path: '/admin/users' },
      { text: 'All Doctors', icon: <LocalHospital />, path: '/admin/doctors' },
      { text: 'System Health', icon: <MonitorHeart />, path: '/admin/system-health' },
      { text: 'Appointments', icon: <CalendarToday />, path: '/admin/appointments' },
      { text: 'Credentials', icon: <Security />, path: '/admin/credentials' },
    ];
  } else {
    return [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ];
  }
};

const TopNavLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auto-logout after 5 minutes of inactivity
  useAutoLogout();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Appointment Reminder', message: 'You have an appointment tomorrow at 10:00 AM', time: '2 hours ago', read: false },
    { id: 2, title: 'Lab Results Ready', message: 'Your blood test results are now available', time: '1 day ago', read: false },
    { id: 3, title: 'Prescription Refill', message: 'Time to refill your medication', time: '2 days ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleChatToggle = () => {
    setChatOpen(!chatOpen);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = getMenuItems(user?.role?.name || 'PATIENT');

  // Mobile Drawer
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="subtitle1">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role?.name}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              cursor: 'pointer',
              bgcolor: isActive(item.path) ? 'action.selected' : 'transparent',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={1} sx={{ borderRadius: 0 }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            🏥 MedReserve
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    bgcolor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    borderRadius: 0,
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side - Dark Mode, Notifications and Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <IconButton color="inherit" onClick={toggleDarkMode} title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification.id} sx={{
              whiteSpace: 'normal',
              alignItems: 'flex-start',
              bgcolor: notification.read ? 'transparent' : 'action.hover'
            }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
        <Divider />
        <MenuItem onClick={handleNotificationClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" color="primary">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { handleNavigation('/profile'); handleProfileMenuClose(); }}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 3,
          mt: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                MedReserve AI
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Advanced Healthcare Management Platform
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Empowering healthcare with AI-driven solutions
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Contact Developer
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" />
                  <Typography
                    variant="body2"
                    component="a"
                    href="mailto:rishithpachipulusu@gmail.com"
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    rishithpachipulusu@gmail.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" />
                  <Typography
                    variant="body2"
                    component="a"
                    href="https://www.linkedin.com/in/rishith-kumar-pachipulusu-13351a31b/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    LinkedIn Profile
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CloudUpload fontSize="small" />
                  <Typography
                    variant="body2"
                    component="a"
                    href="https://github.com/rishith2903/"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    GitHub Repository
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.8 }}>
            © 2024 MedReserve AI. Developed by Rishith Kumar Pachipulusu. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={handleChatToggle}
      >
        <Chat />
      </Fab>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={handleChatToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100vw',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">AI Assistant</Typography>
          <IconButton onClick={handleChatToggle}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Chat functionality will be implemented here. This is a placeholder for the AI chatbot interface.
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TopNavLayout;

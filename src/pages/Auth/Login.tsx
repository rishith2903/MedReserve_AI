import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalHospital,
  Person,
  AdminPanelSettings,
  PlayArrow
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequest } from '../../services/api';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
    setError(null);
  };

  const demoAccounts = [
    {
      type: 'Patient',
      email: 'patient@medreserve.com',
      password: 'password123',
      icon: <Person />,
      color: 'primary' as const,
      description: 'Experience the patient portal'
    },
    {
      type: 'Doctor',
      email: 'doctor@medreserve.com',
      password: 'password123',
      icon: <LocalHospital />,
      color: 'secondary' as const,
      description: 'Access doctor dashboard'
    },
    {
      type: 'Admin',
      email: 'admin@medreserve.com',
      password: 'password123',
      icon: <AdminPanelSettings />,
      color: 'warning' as const,
      description: 'View admin interface'
    }
  ];

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <LocalHospital sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                MedReserve AI
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mb: 3, py: 1.5 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR TRY DEMO
                </Typography>
              </Divider>

              {/* Demo Account Buttons */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
                  Quick Demo Access
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.type}
                      variant="outlined"
                      color={account.color}
                      startIcon={account.icon}
                      endIcon={<PlayArrow />}
                      onClick={() => fillDemoCredentials(account.email, account.password)}
                      sx={{
                        justifyContent: 'space-between',
                        textTransform: 'none',
                        py: 1
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {account.type} Demo
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {account.description}
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Demo Credentials:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Patient: patient@medreserve.com / password123
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Doctor: doctor@medreserve.com / password123
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;

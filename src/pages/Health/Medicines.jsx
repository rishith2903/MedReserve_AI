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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Medication,
  Add,
  Edit,
  Delete,
  Alarm,
  CheckCircle,
  Warning,
  Info,
  Search,
  FilterList,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { prescriptionsAPI } from '../../services/api';

const Medicines = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data for demonstration
  const mockMedicines = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Smith',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      status: 'Active',
      instructions: 'Take with food in the morning',
      remainingDays: 45,
      totalDays: 60,
      category: 'Blood Pressure',
    },
    {
      id: 2,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribedBy: 'Dr. Johnson',
      startDate: '2023-12-15',
      endDate: '2024-06-15',
      status: 'Active',
      instructions: 'Take with meals',
      remainingDays: 120,
      totalDays: 180,
      category: 'Diabetes',
    },
    {
      id: 3,
      name: 'Amoxicillin',
      dosage: '250mg',
      frequency: 'Three times daily',
      prescribedBy: 'Dr. Williams',
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      status: 'Completed',
      instructions: 'Complete full course',
      remainingDays: 0,
      totalDays: 10,
      category: 'Antibiotic',
    },
    {
      id: 4,
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Brown',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      instructions: 'Take with fatty meal',
      remainingDays: 300,
      totalDays: 365,
      category: 'Supplement',
    },
  ];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      // For now, use mock data
      // const response = await prescriptionsAPI.getAll();
      // setMedicines(response.prescriptions || []);
      setMedicines(mockMedicines);
    } catch (err) {
      setError('Failed to fetch medicines');
      setMedicines(mockMedicines); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Completed': return 'info';
      case 'Expired': return 'error';
      case 'Paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle />;
      case 'Completed': return <Info />;
      case 'Expired': return <Warning />;
      case 'Paused': return <Warning />;
      default: return <Info />;
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || medicine.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [...new Set(medicines.map(medicine => medicine.status))];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            My Medicines
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your prescriptions and medication schedule
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Medicine
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search medicines by name or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Medicines Grid */}
      <Grid container spacing={3}>
        {filteredMedicines.map((medicine) => (
          <Grid item xs={12} md={6} lg={4} key={medicine.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Medication />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {medicine.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {medicine.dosage} • {medicine.frequency}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(medicine.status)}
                    label={medicine.status}
                    size="small"
                    color={getStatusColor(medicine.status)}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Prescribed by:</strong> {medicine.prescribedBy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Category:</strong> {medicine.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Instructions:</strong> {medicine.instructions}
                  </Typography>
                </Box>

                {medicine.status === 'Active' && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">
                        {medicine.remainingDays} days left
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((medicine.totalDays - medicine.remainingDays) / medicine.totalDays) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(medicine.startDate).toLocaleDateString()} - {new Date(medicine.endDate).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <IconButton size="small" title="Set Reminder">
                      <Alarm />
                    </IconButton>
                    <IconButton size="small" title="Edit">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" title="Delete">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredMedicines.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Medication sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No medicines found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filterStatus ? 'Try adjusting your search or filter' : 'Add your first medicine to get started'}
          </Typography>
        </Box>
      )}

      {/* Add Medicine Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Medicine</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Medicine Name"
            margin="normal"
            placeholder="e.g., Lisinopril"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Dosage"
                margin="normal"
                placeholder="e.g., 10mg"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Frequency</InputLabel>
                <Select label="Frequency">
                  <MenuItem value="Once daily">Once daily</MenuItem>
                  <MenuItem value="Twice daily">Twice daily</MenuItem>
                  <MenuItem value="Three times daily">Three times daily</MenuItem>
                  <MenuItem value="Four times daily">Four times daily</MenuItem>
                  <MenuItem value="As needed">As needed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Prescribed By"
            margin="normal"
            placeholder="e.g., Dr. Smith"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select label="Category">
              <MenuItem value="Blood Pressure">Blood Pressure</MenuItem>
              <MenuItem value="Diabetes">Diabetes</MenuItem>
              <MenuItem value="Antibiotic">Antibiotic</MenuItem>
              <MenuItem value="Pain Relief">Pain Relief</MenuItem>
              <MenuItem value="Supplement">Supplement</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Instructions"
            margin="normal"
            multiline
            rows={2}
            placeholder="e.g., Take with food"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Medicine</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Medicines;

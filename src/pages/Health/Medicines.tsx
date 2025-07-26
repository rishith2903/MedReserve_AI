import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Medication,
  Search,
  Visibility,
  Schedule,
  Warning,
  CheckCircle,
  Close,
  LocalPharmacy,
  Person,
  DateRange,
  Info,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  remainingDays: number;
  totalDays: number;
  sideEffects?: string[];
  notes?: string;
  refillsRemaining: number;
  appointmentId: number;
}

const Medicines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data - In real app, this would come from API
  const mockMedicines: Medicine[] = [
    {
      id: 1,
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take with or without food. Take at the same time each day.',
      prescribedBy: 'Dr. Jane Smith',
      prescribedDate: '2024-01-15',
      startDate: '2024-01-15',
      endDate: '2024-02-14',
      status: 'ACTIVE',
      remainingDays: 20,
      totalDays: 30,
      sideEffects: ['Dizziness', 'Dry cough', 'Fatigue'],
      notes: 'Monitor blood pressure daily. Contact doctor if persistent cough develops.',
      refillsRemaining: 2,
      appointmentId: 101,
    },
    {
      id: 2,
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 'Once daily',
      duration: 'Ongoing',
      instructions: 'Take with food to reduce stomach irritation.',
      prescribedBy: 'Dr. Jane Smith',
      prescribedDate: '2024-01-15',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: 'ACTIVE',
      remainingDays: 350,
      totalDays: 365,
      sideEffects: ['Stomach upset', 'Bleeding risk'],
      notes: 'Long-term therapy for cardiovascular protection.',
      refillsRemaining: 5,
      appointmentId: 101,
    },
    {
      id: 3,
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: '3 times daily',
      duration: '10 days',
      instructions: 'Take with food. Complete the full course even if feeling better.',
      prescribedBy: 'Dr. Michael Johnson',
      prescribedDate: '2024-01-10',
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      status: 'COMPLETED',
      remainingDays: 0,
      totalDays: 10,
      sideEffects: ['Nausea', 'Diarrhea', 'Allergic reactions'],
      notes: 'Completed course for upper respiratory infection.',
      refillsRemaining: 0,
      appointmentId: 102,
    },
  ];

  const { data: medicines = mockMedicines, isLoading } = useQuery({
    queryKey: ['medicines'],
    queryFn: () => Promise.resolve(mockMedicines), // Replace with actual API call
  });

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMedicines = filteredMedicines.filter(m => m.status === 'ACTIVE');
  const completedMedicines = filteredMedicines.filter(m => m.status === 'COMPLETED');
  const discontinuedMedicines = filteredMedicines.filter(m => m.status === 'DISCONTINUED');

  const handleViewMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'info';
      case 'DISCONTINUED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Schedule color="success" />;
      case 'COMPLETED': return <CheckCircle color="info" />;
      case 'DISCONTINUED': return <Warning color="warning" />;
      default: return <Medication />;
    }
  };

  const calculateProgress = (medicine: Medicine) => {
    if (medicine.status === 'COMPLETED') return 100;
    if (medicine.status === 'DISCONTINUED') return 0;
    return ((medicine.totalDays - medicine.remainingDays) / medicine.totalDays) * 100;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const MedicineCard = ({ medicine }: { medicine: Medicine }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <Medication fontSize="small" />
              </Avatar>
              <Typography variant="h6">{medicine.name}</Typography>
              <Chip 
                label={medicine.status} 
                size="small" 
                color={getStatusColor(medicine.status) as any}
                icon={getStatusIcon(medicine.status)}
              />
            </Box>
            
            <Typography variant="body1" gutterBottom>
              <strong>{medicine.dosage}</strong> • {medicine.frequency}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Prescribed by {medicine.prescribedBy} on {new Date(medicine.prescribedDate).toLocaleDateString()}
            </Typography>
            
            {medicine.status === 'ACTIVE' && (
              <Box mt={2}>
                <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">
                    {medicine.remainingDays} days remaining
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={calculateProgress(medicine)} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}
          </Box>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            onClick={() => handleViewMedicine(medicine)}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Medicines
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Track your current and past medications
      </Typography>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search medicines by name or prescribing doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h4">{activeMedicines.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Medicines
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4">{completedMedicines.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {activeMedicines.reduce((sum, m) => sum + m.refillsRemaining, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Refills
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Medicines */}
      {activeMedicines.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Active Medicines
          </Typography>
          {activeMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </Box>
      )}

      {/* Completed Medicines */}
      {completedMedicines.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Completed Medicines
          </Typography>
          {completedMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </Box>
      )}

      {filteredMedicines.length === 0 && (
        <Alert severity="info">
          No medicines found. Prescriptions will appear here after your appointments.
        </Alert>
      )}

      {/* Medicine Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="between" alignItems="center">
            <Typography variant="h6">Medicine Details</Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        {selectedMedicine && (
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Medication /></ListItemIcon>
                    <ListItemText 
                      primary="Medicine" 
                      secondary={`${selectedMedicine.name} ${selectedMedicine.dosage}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Schedule /></ListItemIcon>
                    <ListItemText 
                      primary="Frequency" 
                      secondary={selectedMedicine.frequency}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText 
                      primary="Prescribed by" 
                      secondary={selectedMedicine.prescribedBy}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DateRange /></ListItemIcon>
                    <ListItemText 
                      primary="Duration" 
                      secondary={`${selectedMedicine.startDate} to ${selectedMedicine.endDate}`}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>Instructions</Typography>
                <Typography variant="body1" paragraph>{selectedMedicine.instructions}</Typography>
                
                {selectedMedicine.notes && (
                  <>
                    <Typography variant="h6" gutterBottom>Notes</Typography>
                    <Typography variant="body1" paragraph>{selectedMedicine.notes}</Typography>
                  </>
                )}
                
                {selectedMedicine.sideEffects && selectedMedicine.sideEffects.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>Possible Side Effects</Typography>
                    <List dense>
                      {selectedMedicine.sideEffects.map((effect, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><Info color="warning" /></ListItemIcon>
                          <ListItemText primary={effect} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Refills Remaining:</strong> {selectedMedicine.refillsRemaining}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        )}
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Medicines;

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
} from '@mui/material';
import {
  Description,
  Download,
  Search,
  Visibility,
  LocalHospital,
  DateRange,
  Person,
  Close,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { appointmentAPI } from '../../services/api';

interface MedicalReport {
  id: number;
  appointmentId: number;
  doctorName: string;
  specialty: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes: string;
  prescriptions: string[];
  followUpRequired: boolean;
  reportType: 'CONSULTATION' | 'LAB_RESULT' | 'IMAGING' | 'DISCHARGE';
}

const MedicalReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data - In real app, this would come from API
  const mockReports: MedicalReport[] = [
    {
      id: 1,
      appointmentId: 101,
      doctorName: 'Dr. Jane Smith',
      specialty: 'Cardiology',
      date: '2024-01-15',
      diagnosis: 'Hypertension Stage 1',
      symptoms: 'Chest pain, shortness of breath',
      treatment: 'Lifestyle modifications, medication prescribed',
      notes: 'Patient advised to monitor blood pressure daily. Follow-up in 4 weeks.',
      prescriptions: ['Lisinopril 10mg daily', 'Aspirin 81mg daily'],
      followUpRequired: true,
      reportType: 'CONSULTATION',
    },
    {
      id: 2,
      appointmentId: 102,
      doctorName: 'Dr. Michael Johnson',
      specialty: 'General Medicine',
      date: '2024-01-10',
      diagnosis: 'Upper Respiratory Infection',
      symptoms: 'Cough, fever, sore throat',
      treatment: 'Antibiotics, rest, increased fluid intake',
      notes: 'Symptoms should improve within 7-10 days. Return if fever persists.',
      prescriptions: ['Amoxicillin 500mg 3x daily', 'Acetaminophen as needed'],
      followUpRequired: false,
      reportType: 'CONSULTATION',
    },
    {
      id: 3,
      appointmentId: 103,
      doctorName: 'Dr. Sarah Wilson',
      specialty: 'Dermatology',
      date: '2024-01-05',
      diagnosis: 'Eczema',
      symptoms: 'Skin rash, itching, dry skin',
      treatment: 'Topical corticosteroids, moisturizers',
      notes: 'Avoid known triggers. Use fragrance-free products.',
      prescriptions: ['Hydrocortisone cream 1%', 'Cetaphil moisturizer'],
      followUpRequired: true,
      reportType: 'CONSULTATION',
    },
  ];

  const { data: reports = mockReports, isLoading } = useQuery({
    queryKey: ['medical-reports'],
    queryFn: () => Promise.resolve(mockReports), // Replace with actual API call
  });

  const filteredReports = reports.filter(report =>
    report.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReport = (report: MedicalReport) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleDownloadReport = (report: MedicalReport) => {
    // In a real app, this would download the actual report
    const reportContent = `
Medical Report
=============
Date: ${report.date}
Doctor: ${report.doctorName}
Specialty: ${report.specialty}
Diagnosis: ${report.diagnosis}
Symptoms: ${report.symptoms}
Treatment: ${report.treatment}
Notes: ${report.notes}
Prescriptions: ${report.prescriptions.join(', ')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'CONSULTATION': return 'primary';
      case 'LAB_RESULT': return 'secondary';
      case 'IMAGING': return 'info';
      case 'DISCHARGE': return 'success';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Medical Reports
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        View and download your medical reports from previous appointments
      </Typography>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search reports by doctor, specialty, or diagnosis..."
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

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Alert severity="info">
          No medical reports found. Reports will appear here after your appointments.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredReports.map((report) => (
            <Grid item xs={12} key={report.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6">
                          {report.doctorName}
                        </Typography>
                        <Chip 
                          label={report.reportType.replace('_', ' ')} 
                          size="small" 
                          color={getReportTypeColor(report.reportType) as any}
                        />
                        {report.followUpRequired && (
                          <Chip label="Follow-up Required" size="small" color="warning" />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {report.specialty} • {new Date(report.date).toLocaleDateString()}
                      </Typography>
                      
                      <Typography variant="body1" gutterBottom>
                        <strong>Diagnosis:</strong> {report.diagnosis}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary">
                        <strong>Symptoms:</strong> {report.symptoms}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewReport(report)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleDownloadReport(report)}
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Report Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="between" alignItems="center">
            <Typography variant="h6">Medical Report Details</Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        {selectedReport && (
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText 
                      primary="Doctor" 
                      secondary={selectedReport.doctorName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocalHospital /></ListItemIcon>
                    <ListItemText 
                      primary="Specialty" 
                      secondary={selectedReport.specialty}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DateRange /></ListItemIcon>
                    <ListItemText 
                      primary="Date" 
                      secondary={new Date(selectedReport.date).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Diagnosis</Typography>
                <Typography variant="body1" paragraph>{selectedReport.diagnosis}</Typography>
                
                <Typography variant="h6" gutterBottom>Symptoms</Typography>
                <Typography variant="body1" paragraph>{selectedReport.symptoms}</Typography>
                
                <Typography variant="h6" gutterBottom>Treatment</Typography>
                <Typography variant="body1" paragraph>{selectedReport.treatment}</Typography>
                
                <Typography variant="h6" gutterBottom>Doctor's Notes</Typography>
                <Typography variant="body1" paragraph>{selectedReport.notes}</Typography>
                
                {selectedReport.prescriptions.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>Prescriptions</Typography>
                    <List dense>
                      {selectedReport.prescriptions.map((prescription, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={prescription} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        )}
        
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {selectedReport && (
            <Button 
              variant="contained" 
              startIcon={<Download />}
              onClick={() => handleDownloadReport(selectedReport)}
            >
              Download Report
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalReports;

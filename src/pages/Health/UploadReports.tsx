import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Fab,
} from '@mui/material';
import {
  Add,
  CloudUpload,
  Description,
  Delete,
  LocalHospital,
  DateRange,
  Person,
  Visibility,
} from '@mui/icons-material';

interface UploadedReport {
  id: number;
  title: string;
  hospitalName: string;
  doctorName: string;
  reportType: string;
  date: string;
  fileName: string;
  fileSize: string;
  description?: string;
}

const UploadReports: React.FC = () => {
  const [reports, setReports] = useState<UploadedReport[]>([
    {
      id: 1,
      title: 'Blood Test Results',
      hospitalName: 'City General Hospital',
      doctorName: 'Dr. Sarah Wilson',
      reportType: 'Lab Report',
      date: '2024-01-15',
      fileName: 'blood_test_jan_2024.pdf',
      fileSize: '2.3 MB',
      description: 'Complete blood count and lipid profile'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    hospitalName: '',
    doctorName: '',
    reportType: '',
    date: '',
    description: '',
    file: null as File | null,
  });

  const reportTypes = [
    'Lab Report',
    'X-Ray',
    'MRI Scan',
    'CT Scan',
    'Ultrasound',
    'ECG',
    'Prescription',
    'Discharge Summary',
    'Consultation Report',
    'Other'
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.hospitalName || !formData.reportType || !formData.date || !formData.file) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    const newReport: UploadedReport = {
      id: Date.now(),
      title: formData.title,
      hospitalName: formData.hospitalName,
      doctorName: formData.doctorName,
      reportType: formData.reportType,
      date: formData.date,
      fileName: formData.file.name,
      fileSize: `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`,
      description: formData.description,
    };

    setReports(prev => [newReport, ...prev]);
    setDialogOpen(false);
    setFormData({
      title: '',
      hospitalName: '',
      doctorName: '',
      reportType: '',
      date: '',
      description: '',
      file: null,
    });
  };

  const handleDelete = (id: number) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'Lab Report': return 'primary';
      case 'X-Ray': return 'secondary';
      case 'MRI Scan': return 'info';
      case 'CT Scan': return 'warning';
      case 'Prescription': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Medical Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload and manage your medical reports from different hospitals
          </Typography>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Description color="primary" />
                <Box>
                  <Typography variant="h4">{reports.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reports
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
                <LocalHospital color="secondary" />
                <Box>
                  <Typography variant="h4">
                    {new Set(reports.map(r => r.hospitalName)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hospitals
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
                <DateRange color="info" />
                <Box>
                  <Typography variant="h4">
                    {reports.length > 0 ? new Date(Math.max(...reports.map(r => new Date(r.date).getTime()))).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest Report
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reports List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Uploaded Reports
          </Typography>
          
          {reports.length === 0 ? (
            <Alert severity="info">
              No reports uploaded yet. Click the + button to add your first medical report.
            </Alert>
          ) : (
            <List>
              {reports.map((report) => (
                <ListItem key={report.id} divider>
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {report.title}
                        </Typography>
                        <Chip 
                          label={report.reportType} 
                          size="small" 
                          color={getReportTypeColor(report.reportType) as any}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <LocalHospital fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                          {report.hospitalName}
                          {report.doctorName && (
                            <>
                              {' • '}
                              <Person fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                              {report.doctorName}
                            </>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <DateRange fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                          {new Date(report.date).toLocaleDateString()} • {report.fileName} ({report.fileSize})
                        </Typography>
                        {report.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {report.description}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" sx={{ mr: 1 }}>
                      <Visibility />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(report.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add report"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => setDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Medical Report</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Report Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={formData.reportType}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
                  label="Report Type"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Doctor Name"
                value={formData.doctorName}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Report Date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{ height: 56 }}
              >
                {formData.file ? formData.file.name : 'Upload File'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Upload Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UploadReports;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Psychology } from '@mui/icons-material';
import { mlAPI } from '../../services/api';

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await mlAPI.predictSpecialty({
        symptoms,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
      });
      
      setPrediction(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Psychology sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight="bold">
          AI Symptom Checker
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" mb={4}>
        Describe your symptoms and get AI-powered medical specialty recommendations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Describe Your Symptoms
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Symptoms"
                  placeholder="Describe your symptoms in detail..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Age (Optional)"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender (Optional)"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      SelectProps={{ native: true }}
                    >
                      <option value=""></option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </TextField>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading || !symptoms.trim()}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Psychology />}
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {prediction && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Recommendation
                </Typography>
                
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Recommended Specialty:
                  </Typography>
                  <Chip
                    label={prediction.recommendedSpecialty}
                    color="primary"
                    size="medium"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {(prediction.confidenceScore * 100).toFixed(1)}%
                  </Typography>
                </Box>

                {prediction.predictions && prediction.predictions.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Other Possibilities:
                    </Typography>
                    {prediction.predictions.slice(0, 3).map((pred: any, index: number) => (
                      <Box key={index} mb={1}>
                        <Chip
                          label={`${pred.specialty} (${(pred.confidence * 100).toFixed(1)}%)`}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                <Alert severity="info" sx={{ mt: 3 }}>
                  This is an AI-powered recommendation and should not replace professional medical advice. 
                  Please consult with a healthcare provider for proper diagnosis and treatment.
                </Alert>
              </CardContent>
            </Card>
          )}

          {!prediction && !error && (
            <Card>
              <CardContent>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Enter your symptoms to get AI-powered specialty recommendations
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SymptomChecker;

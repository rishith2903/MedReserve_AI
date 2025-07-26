import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Phone, LocalHospital } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { smartFeaturesAPI } from '../../services/api';

const EmergencyContacts: React.FC = () => {
  const { data: contacts = [] } = useQuery({
    queryKey: ['emergency-contacts'],
    queryFn: () => smartFeaturesAPI.getEmergencyContacts().then(res => res.data),
  });

  const handleCall = (number: string) => {
    window.open(`tel:${number}`);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <LocalHospital sx={{ fontSize: 32, mr: 2, color: 'error.main' }} />
        <Typography variant="h4" fontWeight="bold">
          Emergency Contacts
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" mb={4}>
        Important emergency contact numbers for immediate assistance
      </Typography>

      <Grid container spacing={3}>
        {contacts.map((contact: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {contact.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {contact.type}
                </Typography>
                <Typography variant="h5" color="primary" mb={2}>
                  {contact.number}
                </Typography>
                <Button
                  variant="contained"
                  color={contact.type.includes('Emergency') ? 'error' : 'primary'}
                  startIcon={<Phone />}
                  onClick={() => handleCall(contact.number)}
                  fullWidth
                >
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmergencyContacts;

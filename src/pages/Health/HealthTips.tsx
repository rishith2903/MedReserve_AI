import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { smartFeaturesAPI } from '../../services/api';

const HealthTips: React.FC = () => {
  const { data: healthTips = [] } = useQuery({
    queryKey: ['health-tips'],
    queryFn: () => smartFeaturesAPI.getHealthTips().then(res => res.data),
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Health Tips
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Personalized health recommendations to improve your wellbeing
      </Typography>

      <Grid container spacing={3}>
        {healthTips.map((tip: any, index: number) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    label={tip.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={tip.importance}
                    size="small"
                    color={tip.importance === 'High' ? 'error' : 'default'}
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography variant="body1">
                  {tip.tip}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HealthTips;

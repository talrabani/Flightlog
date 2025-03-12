import React from 'react';
import {
  TextField,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';

const CrewSelector = ({ formData, handleChange }) => {
  return (
    <Box sx={{ 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 1,
      p: 2,
      mb: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#f8f9fa'
    }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BadgeIcon color="primary" />
        Pilots
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            name="pilot_in_command"
            label="Pilot in Command"
            value={formData.pilot_in_command}
            onChange={handleChange}
            fullWidth
            required
            sx={{ backgroundColor: 'white' }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            name="other_crew"
            label="Other Crew"
            value={formData.other_crew}
            onChange={handleChange}
            fullWidth
            sx={{ backgroundColor: 'white' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CrewSelector; 
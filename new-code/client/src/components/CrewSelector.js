import React from 'react';
import {
  TextField,
  Typography,
  Box,
  Grid,
} from '@mui/material';

const CrewSelector = ({ formData, handleChange }) => {
  return (
    <Box sx={{ 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 1,
      p: 2,
      mb: 2
    }}>
      <Typography variant="subtitle1" gutterBottom>
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
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            name="other_crew"
            label="Other Crew"
            value={formData.other_crew}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CrewSelector; 
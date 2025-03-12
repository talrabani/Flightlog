import React from 'react';
import {
  TextField,
  Grid,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import FormBox from './FormBox';

const CrewSelector = ({ formData, handleChange }) => {
  return (
    <FormBox title="Pilots" icon={<BadgeIcon color="primary" />}>
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
    </FormBox>
  );
};

export default CrewSelector; 
import React from 'react';
import { Grid, TextField } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FormBox from './FormBox';

function DateSelector({ formData, handleChange }) {
  return (
    <Grid item xs={12}>
      <FormBox title="Date" icon={<CalendarTodayIcon color="primary" />}>
        <TextField
          name="flight_date"
          type="date"
          sx={{ backgroundColor: 'white' }}
          value={formData.flight_date}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />
      </FormBox>
    </Grid>
  );
}

export default DateSelector; 
import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import FormBox from './FormBox';

function AdditionalInfo({ formData, handleChange }) {
  return (
    <FormBox title="Additional Information" icon={<NoteIcon color="primary" />}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="flight-type-label">Flight Type</InputLabel>
            <Select
              labelId="flight-type-label"
              name="flight_type"
              sx={{ backgroundColor: 'white' }}
              value={formData.flight_type}
              onChange={handleChange}
              label="Flight Type"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="training">Training</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="checkride">Checkride</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="flight-rule-label">Flight Rule</InputLabel>
            <Select
              labelId="flight-rule-label"
              name="flight_rule"
              sx={{ backgroundColor: 'white' }}
              value={formData.flight_rule}
              onChange={handleChange}
              label="Flight Rule"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="VFR">VFR</MenuItem>
              <MenuItem value="IFR">IFR</MenuItem>
              <MenuItem value="SVFR">Special VFR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="details"
            label="Details"
            sx={{ backgroundColor: 'white' }}
            multiline
            rows={4}
            value={formData.details}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </FormBox>
  );
}

export default AdditionalInfo; 
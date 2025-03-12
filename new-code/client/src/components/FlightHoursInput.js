import React from 'react';
import {
  TextField,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
} from '@mui/material';

const FlightHoursInput = ({ formData, handleChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 2,
          mb: 3
        }}>
          <TextField
            name="icus_day"
            label="ICUS Day"
            type="number"
            value={formData.icus_day}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="icus_night"
            label="ICUS Night"
            type="number"
            value={formData.icus_night}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="dual_day"
            label="Dual Day"
            type="number"
            value={formData.dual_day}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="dual_night"
            label="Dual Night"
            type="number"
            value={formData.dual_night}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="command_day"
            label="Com Day"
            type="number"
            value={formData.command_day}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="command_night"
            label="Com Night"
            type="number"
            value={formData.command_night}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3
        }}>
          <TextField
            name="co_pilot_day"
            label="Co-Pilot Day"
            type="number"
            value={formData.co_pilot_day}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="co_pilot_night"
            label="Co-Pilot Night"
            type="number"
            value={formData.co_pilot_night}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="instrument_flight"
            label="Instrument Day"
            type="number"
            value={formData.instrument_flight}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
          <TextField
            name="instrument_sim"
            label="Instrument Night"
            type="number"
            value={formData.instrument_sim}
            onChange={handleChange}
            inputProps={{ step: "0.1", min: "0" }}
            size="small"
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        <TextField
          name="details"
          label="Details"
          multiline
          rows={4}
          value={formData.details}
          onChange={handleChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Engine Type</FormLabel>
          <RadioGroup
            row
            name="engine_type"
            value={formData.engine_type}
            onChange={handleChange}
          >
            <FormControlLabel
              value="Single-Engine"
              control={<Radio />}
              label="Single-Engine (S)"
            />
            <FormControlLabel
              value="Multi-Engine"
              control={<Radio />}
              label="Multi-Engine (M)"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FlightHoursInput; 
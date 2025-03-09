import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  MenuItem,
  Alert,
  Autocomplete,
  capitalize
} from '@mui/material';
import config from '../config';

function AddLog() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [aircraftOptions, setAircraftOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    flight_date: '',
    aircraft_type: '',
    aircraft_reg: '',
    pilot_in_command: '',
    other_crew: '',
    route: '',
    details: '',
    engine_type: 'Single-Engine',
    icus_day: '0',
    icus_night: '0',
    dual_day: '0',
    dual_night: '0',
    command_day: '0',
    command_night: '0',
    co_pilot_day: '0',
    co_pilot_night: '0',
    instrument_flight: '0',
    instrument_sim: '0'
  });

  const searchAircraft = async (searchText) => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.apiUrl}/api/aircraft-types/search`, {
        params: { query: searchText }
      });
      setAircraftOptions(response.data);
    } catch (error) {
      console.error('Error searching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const numericFields = [
        'icus_day', 'icus_night', 'dual_day', 'dual_night',
        'command_day', 'command_night', 'co_pilot_day', 'co_pilot_night',
        'instrument_flight', 'instrument_sim'
      ];

      const processedData = {
        ...formData,
        userId: 1,
      };

      numericFields.forEach(field => {
        processedData[field] = parseFloat(formData[field]) || 0;
      });

      await axios.post(`${config.apiUrl}/api/logbook`, processedData);
      navigate('/logbook');
    } catch (err) {
      setError('Error adding logbook entry. Please try again.');
      console.error('Error:', err);
    }
  };

  const TimeField = ({ name, label }) => (
    <TextField
      name={name}
      label={label}
      type="number"
      value={formData[name]}
      onChange={handleChange}
      inputProps={{ step: "0.1", min: "0", max: "24" }}
      fullWidth
      margin="normal"
    />
  );

  return (
    <Container maxWidth={false} sx={{ width: '95%' }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add Flight Log Entry
        </Typography>
        <Paper sx={{ 
          p: 4, 
          maxWidth: '100%',
          '& .MuiGrid-container': {
            width: '100%',
            margin: 0
          }
        }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={12} md={6} sx={{ pr: { md: 3 } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="flight_date"
                      label="Date"
                      type="date"
                      value={formData.flight_date}
                      onChange={handleChange}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Autocomplete
                      options={aircraftOptions}
                      getOptionLabel={(option) => `${option.model}, ${option.manufacturer.toUpperCase()} - ${option.designator}`}
                      filterOptions={(options, state) => options}
                      onInputChange={(event, newInputValue) => {
                        if (newInputValue && newInputValue.length >= 2) {
                          searchAircraft(newInputValue);
                        }
                      }}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          aircraft_type: newValue ? newValue.designator : ''
                        }));
                      }}
                      loading={loading}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <div>
                            <strong>{option.model}</strong>, {option.manufacturer.toUpperCase()} - {option.designator}
                            <span style={{ marginLeft: '8px', color: '#666' }}>
                              (WTC: {option.wtc})
                            </span>
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Aircraft Type"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      name="aircraft_reg"
                      label="Aircraft Registration"
                      value={formData.aircraft_reg}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>

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

                  <Grid item xs={12}>
                    <TextField
                      name="route"
                      label="Route"
                      value={formData.route}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6} sx={{ pl: { md: 3 } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="engine_type"
                      select
                      label="Engine Type"
                      value={formData.engine_type}
                      onChange={handleChange}
                      fullWidth
                      required
                    >
                      <MenuItem value="Single-Engine">Single-Engine</MenuItem>
                      <MenuItem value="Multi-Engine">Multi-Engine</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Time inputs grid */}
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
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Add Flight Log Entry
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddLog; 
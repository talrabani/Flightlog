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
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import config from '../config';
import AircraftSelector from '../components/AircraftSelector';
import RouteSelector from '../components/RouteSelector';
import FlightHoursInput from '../components/FlightHoursInput';
import CrewSelector from '../components/CrewSelector';

function AddLog() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    flight_date: '',
    aircraft_reg: '',
    aircraft_model: '',
    aircraft_manufacturer: '',
    aircraft_designator: '',
    aircraft_wtc: '',
    aircraft_category: 'A', // Default to Airplane
    aircraft_class: 'S', // Default to Single-Engine
    pilot_in_command: '',
    other_crew: '',
    route_data: [
      { type: 'departure', airport_id: null, airport_data: null, is_custom: false, custom_name: null },
      { type: 'arrival', airport_id: null, airport_data: null, is_custom: false, custom_name: null }
    ],
    details: '',
    flight_type: '', // New field for flight type
    flight_rule: '', // New field for flight rule
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Handling change for:', name, value);
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
        aircraft_reg: formData.aircraft_reg,
        route_data: formData.route_data.map(stop => ({
          type: stop.type,
          airport_id: stop.airport_id,
          is_custom: stop.is_custom,
          custom_name: stop.custom_name
        }))
      };

      numericFields.forEach(field => {
        processedData[field] = parseFloat(formData[field]) || 0;
      });
      
      console.log('Form data:', formData);
      console.log('Processed data:', processedData);

      await axios.post(`${config.apiUrl}/api/logbook`, processedData);
      navigate('/logbook');
    } catch (err) {
      setError('Error adding logbook entry. Please try again.');
      console.error('Error:', err);
    }
  };

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
              <Grid item xs={12} md={5} sx={{ pr: { md: 3 } }}>
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
                  
                  <Grid item xs={12}>
                    <AircraftSelector 
                      formData={formData} 
                      setFormData={setFormData} 
                      setError={setError} 
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CrewSelector
                      formData={formData}
                      handleChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <RouteSelector 
                      formData={formData} 
                      setFormData={setFormData} 
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={7} sx={{ pl: { md: 3 } }}>
                <FlightHoursInput 
                  formData={formData} 
                  handleChange={handleChange} 
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="flight-type-label">Flight Type</InputLabel>
                      <Select
                        labelId="flight-type-label"
                        name="flight_type"
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
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel id="flight-rule-label">Flight Rule</InputLabel>
                      <Select
                        labelId="flight-rule-label"
                        name="flight_rule"
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
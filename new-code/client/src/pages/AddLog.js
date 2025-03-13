import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import config from '../config';
import { 
  DateSelector, 
  AdditionalInfo, 
  ActionButtons,
  AircraftSelector,
  CrewSelector,
  FlightHoursInput,
  RouteSelector
} from '../components/AddLogComponents';

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
    flight_type: '', 
    flight_rule: '', 
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

  const handleCancel = () => {
    navigate('/logbook');
  };

  return (
    <Container maxWidth={false} sx={{ 
      width: '100%', 
      backgroundColor: '#f5f5f5', 
      py: 2, 
      minHeight: '100vh',
      px: 0 // Remove horizontal padding
    }}>
      <Box sx={{ my: 2, mx: 0 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 1,
          mb: 2
        }}>
          <FlightIcon fontSize="medium" color="primary" />
          Add Log
        </Typography>
        <Paper sx={{ 
          p: 2,
          maxWidth: '100%',
          backgroundColor: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: 0,
          '& .MuiGrid-container': {
            width: '100%',
            margin: 0
          }
        }}>
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              {/* Left Column */}
              <Grid item xs={12} md={5} sx={{ pr: { md: 1 } }}>
                <Grid container spacing={0.5}>
                  <DateSelector formData={formData} handleChange={handleChange} />
                  
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
              <Grid item xs={12} md={7} sx={{ pl: { md: 1 } }}>
                <FlightHoursInput 
                  formData={formData} 
                  handleChange={handleChange} 
                />

                <AdditionalInfo formData={formData} handleChange={handleChange} />
              </Grid>

              <ActionButtons handleCancel={handleCancel} />
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default AddLog; 
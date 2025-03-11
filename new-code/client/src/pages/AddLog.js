import React, { useState, useEffect } from 'react';
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
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import config from '../config';

function AddLog() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [aircraftOptions, setAircraftOptions] = useState([]);
  const [airportOptions, setAirportOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCustomAircraftFields, setShowCustomAircraftFields] = useState(false);
  const [formData, setFormData] = useState({
    flight_date: '',
    aircraft_type: '',
    aircraft_reg: '',
    aircraft_model: '',
    aircraft_manufacturer: '',
    aircraft_designator: '',
    aircraft_wtc: '',
    pilot_in_command: '',
    other_crew: '',
    route_data: [
      { type: 'departure', airport_id: null, airport_data: null, is_custom: false, custom_name: null },
      { type: 'arrival', airport_id: null, airport_data: null, is_custom: false, custom_name: null }
    ],
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
      console.log('Aircraft search response:', response.data);
      setAircraftOptions(response.data);
    } catch (error) {
      console.error('Error searching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAirports = async (searchText) => {
    try {
      console.log('Searching airports with URL:', `${config.apiUrl}/api/airports/search?query=${searchText}`);
      const response = await axios.get(`${config.apiUrl}/api/airports/search`, {
        params: { query: searchText }
      });
      console.log('Airport search response:', response.data);
      setAirportOptions(response.data);
    } catch (error) {
      console.error('Error searching airports:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Handling change for:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRouteChange = (index, value) => {
    console.log('Selected airport:', value);
    const newRouteData = [...formData.route_data];
    newRouteData[index] = {
      ...newRouteData[index],
      type: index === 0 ? 'departure' : index === formData.route_data.length - 1 ? 'arrival' : 'stop',
      airport_id: value ? value.id : null,
      airport_data: value,
      is_custom: false,
      custom_name: null
    };
    setFormData(prev => ({
      ...prev,
      route_data: newRouteData
    }));
  };

  const addRouteStop = () => {
    setFormData(prev => ({
      ...prev,
      route_data: [
        ...prev.route_data.slice(0, -1),
        { type: 'stop', airport_id: null, airport_data: null, is_custom: false, custom_name: null },
        prev.route_data[prev.route_data.length - 1]
      ]
    }));
  };

  const removeRouteStop = (index) => {
    if (index === 0 || index === formData.route_data.length - 1) return; // Only protect departure and arrival
    setFormData(prev => ({
      ...prev,
      route_data: prev.route_data.filter((_, i) => i !== index)
    }));
  };

  const handleAircraftSelect = (selectedAircraft) => {
    console.log('Selected aircraft:', selectedAircraft);
    setFormData(prevData => ({
      ...prevData,
      aircraft_type: selectedAircraft,
      aircraft_reg: selectedAircraft.registration || ''
    }));
  };

  const saveCustomAircraft = async () => {
    try {
      // Validate custom aircraft fields
      if (!formData.aircraft_model || !formData.aircraft_manufacturer || 
          !formData.aircraft_designator || !formData.aircraft_wtc) {
        setError('Please fill in all aircraft fields');
        return false;
      }

      const customAircraftData = {
        userId: 1, // Replace with actual user ID
        aircraft_reg: formData.aircraft_reg,
        aircraft_designator: formData.aircraft_designator,
        aircraft_manufacturer: formData.aircraft_manufacturer,
        aircraft_model: formData.aircraft_model,
        aircraft_wtc: formData.aircraft_wtc,
        aircraft_category: 'A', // Assuming 'A' for Airplane
        aircraft_class: formData.engine_type === 'Single-Engine' ? 'S' : 'M'
      };

      const response = await axios.post(`${config.apiUrl}/api/user-aircraft`, customAircraftData);
      console.log('Custom aircraft saved:', response.data);
      return true;
    } catch (error) {
      console.error('Error saving custom aircraft:', error);
      setError('Error saving custom aircraft. Please try again.');
      return false;
    }
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

      // If using custom aircraft, save it first
      if (showCustomAircraftFields) {
        const success = await saveCustomAircraft();
        if (!success) return;
      }

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
                  
                  <Grid item xs={12}>
                    <Box sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1,
                      p: 2,
                      mb: 2
                    }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Aircraft
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Autocomplete
                            options={aircraftOptions}
                            getOptionLabel={(option) => 
                              `${option.model}, ${option.manufacturer.toUpperCase()} - ${option.designator}`
                            }
                            filterOptions={(options) => options}
                            onInputChange={(event, newInputValue) => {
                              if (newInputValue && newInputValue.length >= 2) {
                                searchAircraft(newInputValue);
                              }
                            }}
                            onChange={(event, newValue) => {
                              setShowCustomAircraftFields(false);
                              handleAircraftSelect(newValue);
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
                                label="Aircraft Type Search"
                                required={!showCustomAircraftFields}
                                fullWidth
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            name="aircraft_reg"
                            label="Registration"
                            value={formData.aircraft_reg}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>

                        <Grid item xs={12}>
                          {!showCustomAircraftFields ? (
                            <Button
                              onClick={() => setShowCustomAircraftFields(true)}
                              color="primary"
                              sx={{ mt: 1 }}
                            >
                              + Add Custom Aircraft Type
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setShowCustomAircraftFields(false);
                                setFormData(prev => ({
                                  ...prev,
                                  aircraft_model: '',
                                  aircraft_manufacturer: '',
                                  aircraft_designator: '',
                                  aircraft_wtc: ''
                                }));
                              }}
                              color="primary"
                              sx={{ mt: 1 }}
                            >
                              - Cancel Custom Aircraft
                            </Button>
                          )}
                        </Grid>

                        {showCustomAircraftFields && (
                          <>
                            <Grid item xs={6}>
                              <TextField
                                name="aircraft_model"
                                label="Model"
                                value={formData.aircraft_model}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!formData.aircraft_model && showCustomAircraftFields}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                name="aircraft_manufacturer"
                                label="Manufacturer"
                                value={formData.aircraft_manufacturer}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!formData.aircraft_manufacturer && showCustomAircraftFields}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                name="aircraft_designator"
                                label="Designator"
                                value={formData.aircraft_designator}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!formData.aircraft_designator && showCustomAircraftFields}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                select
                                name="aircraft_wtc"
                                label="Wake Turbulence Category"
                                value={formData.aircraft_wtc}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={!formData.aircraft_wtc && showCustomAircraftFields}
                              >
                                <MenuItem value="L">Light</MenuItem>
                                <MenuItem value="M">Medium</MenuItem>
                                <MenuItem value="H">Heavy</MenuItem>
                                <MenuItem value="J">Super</MenuItem>
                              </TextField>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Box>
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
                    <Box sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1,
                      p: 2
                    }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Routes
                      </Typography>
                      
                      {formData.route_data.map((stop, index) => (
                        <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                          <Autocomplete
                            options={airportOptions}
                            getOptionLabel={(option) => 
                              option ? `${option.icao} - ${option.airport_name}` : ''
                            }
                            value={stop.airport_data || null}
                            onChange={(_, newValue) => handleRouteChange(index, newValue)}
                            onInputChange={(_, newInputValue) => {
                              if (newInputValue.length >= 2) {
                                searchAirports(newInputValue);
                              }
                            }}
                            renderOption={(props, option) => (
                              <li {...props}>
                                <Typography component="span">
                                  <strong>{option.icao}</strong> - {option.airport_name}
                                </Typography>
                              </li>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  index === 0 ? "Departure Airport" :
                                  index === formData.route_data.length - 1 ? "Arrival Airport" :
                                  `Stop ${index}`
                                }
                                required
                                fullWidth
                              />
                            )}
                            sx={{ flex: 1 }}
                            isOptionEqualToValue={(option, value) => {
                              if (!option || !value) return false;
                              return option.id === value.id;
                            }}
                            filterOptions={(x) => x}
                          />
                          {index !== 0 && index !== formData.route_data.length - 1 && (
                            <IconButton 
                              onClick={() => removeRouteStop(index)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      ))}
                      
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addRouteStop}
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Add Stop
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6} sx={{ pl: { md: 3 } }}>
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
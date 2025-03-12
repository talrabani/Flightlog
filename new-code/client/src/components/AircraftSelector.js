import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import FormBox from './FormBox';
import config from '../config';

const AircraftSelector = ({ formData, setFormData, setError }) => {
  const [aircraftFound, setAircraftFound] = useState(false);
  const [searchingAircraft, setSearchingAircraft] = useState(false);
  const [aircraftTypeOptions, setAircraftTypeOptions] = useState([]);
  const [loadingAircraftTypes, setLoadingAircraftTypes] = useState(false);
  const timeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Check aircraft registration when the registration field changes
  useEffect(() => {
    if (formData.aircraft_reg && formData.aircraft_reg.length >= 2) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout to delay the API call
      setSearchingAircraft(true);
      timeoutRef.current = setTimeout(() => {
        checkAircraftRegistration();
      }, 500); // 500ms delay to prevent too many API calls
    } else {
      setAircraftFound(false);
      // Clear aircraft fields when registration is cleared
      setFormData(prev => ({
        ...prev,
        aircraft_model: '',
        aircraft_manufacturer: '',
        aircraft_designator: '',
        aircraft_wtc: '',
        aircraft_category: 'A',
        aircraft_class: 'S',
        engine_type: ''
      }));
    }
    
    // Cleanup function to clear timeout when component unmounts or effect reruns
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData.aircraft_reg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If the registration field is changed, reset the aircraft found state
    if (name === 'aircraft_reg') {
      setAircraftFound(false);
    }
    
    // If changing the aircraft class, update engine type in uppercase
    if (name === 'aircraft_class') {
      setFormData(prev => ({
        ...prev,
        engine_type: value === 'S' ? 'SINGLE-ENGINE' : 'MULTI-ENGINE'
      }));
    }
  };

  const searchAircraftTypes = async (searchText) => {
    if (!searchText || searchText.length < 2) return;
    
    try {
      setLoadingAircraftTypes(true);
      
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Set a new timeout to delay the API call
      searchTimeoutRef.current = setTimeout(async () => {
        const response = await axios.get(`${config.apiUrl}/api/aircraft-types/search`, {
          params: { query: searchText }
        });
        console.log('Aircraft types search response:', response.data);
        setAircraftTypeOptions(response.data);
        setLoadingAircraftTypes(false);
      }, 300);
    } catch (error) {
      console.error('Error searching aircraft types:', error);
      setLoadingAircraftTypes(false);
    }
  };

  const handleAircraftTypeSelect = (selectedType) => {
    if (!selectedType) return;
    
    console.log('Selected aircraft type:', selectedType);
    setFormData(prev => ({
      ...prev,
      aircraft_model: selectedType.model || '',
      aircraft_manufacturer: selectedType.manufacturer || '',
      aircraft_designator: selectedType.designator || '',
      aircraft_wtc: selectedType.wtc || '',
    }));
  };

  const checkAircraftRegistration = async () => {
    if (!formData.aircraft_reg || formData.aircraft_reg.length < 2) {
      setSearchingAircraft(false);
      return;
    }

    try {
      // Assuming user ID 1 for now, should be replaced with actual user ID
      const userId = 1;
      const response = await axios.get(
        `${config.apiUrl}/api/user-aircraft/${userId}/registration/${formData.aircraft_reg}`
      );
      
      if (response.data.found) {
        setAircraftFound(true);
        const aircraft = response.data.aircraft;
        setFormData(prev => ({
          ...prev,
          aircraft_model: aircraft.aircraft_model,
          aircraft_manufacturer: aircraft.aircraft_manufacturer,
          aircraft_designator: aircraft.aircraft_designator,
          aircraft_wtc: aircraft.aircraft_wtc,
          aircraft_category: aircraft.aircraft_category,
          aircraft_class: aircraft.aircraft_class,
          engine_type: aircraft.aircraft_class === 'S' ? 'SINGLE-ENGINE' : 'MULTI-ENGINE'
        }));
      } else {
        setAircraftFound(false);
        // Clear aircraft fields when not found to ensure user enters new data
        setFormData(prev => ({
          ...prev,
          aircraft_model: '',
          aircraft_manufacturer: '',
          aircraft_designator: '',
          aircraft_wtc: '',
          aircraft_category: 'A',
          aircraft_class: 'S',
          engine_type: ''
        }));
      }
    } catch (error) {
      console.error('Error checking aircraft registration:', error);
      setAircraftFound(false);
      // Clear aircraft fields on error
      setFormData(prev => ({
        ...prev,
        aircraft_model: '',
        aircraft_manufacturer: '',
        aircraft_designator: '',
        aircraft_wtc: '',
        aircraft_category: 'A',
        aircraft_class: 'S',
        engine_type: ''
      }));
    } finally {
      setSearchingAircraft(false);
    }
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
        aircraft_category: formData.aircraft_category || 'A', // Assuming 'A' for Airplane
        aircraft_class: formData.engine_type === 'SINGLE-ENGINE' ? 'S' : 'M'
      };

      const response = await axios.post(`${config.apiUrl}/api/user-aircraft`, customAircraftData);
      console.log('Custom aircraft saved:', response.data);
      setAircraftFound(true);
      return true;
    } catch (error) {
      console.error('Error saving custom aircraft:', error);
      setError('Error saving custom aircraft. Please try again.');
      return false;
    }
  };

  return (
    <FormBox title="Aircraft" icon={<AirplanemodeActiveIcon color="primary" />}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              name="aircraft_reg"
              label="Registration"
              value={formData.aircraft_reg}
              onChange={handleChange}
              fullWidth
              required
              helperText={searchingAircraft ? "Checking registration..." : ""}
              sx={{ backgroundColor: 'white' }}
            />
            {searchingAircraft && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  marginTop: '-12px',
                }}
              />
            )}
          </Box>
        </Grid>

        {aircraftFound && (
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Category:</TableCell>
                    <TableCell>{formData.aircraft_category === 'A' ? 'Airplane' : formData.aircraft_category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Model:</TableCell>
                    <TableCell>{formData.aircraft_model}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Manufacturer:</TableCell>
                    <TableCell>{formData.aircraft_manufacturer}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Class:</TableCell>
                    <TableCell>{formData.aircraft_class === 'S' ? 'Single-Engine' : 'Multi-Engine'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">WTC:</TableCell>
                    <TableCell>{formData.aircraft_wtc}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {!aircraftFound && formData.aircraft_reg && !searchingAircraft && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Aircraft registration is not found in your aircraft list. Please enter the aircraft details below.
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mb: 2 }}>
                <Autocomplete
                  options={aircraftTypeOptions}
                  getOptionLabel={(option) => 
                    `${option.model}, ${option.manufacturer.toUpperCase()} - ${option.designator}`
                  }
                  filterOptions={(options) => options}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue && newInputValue.length >= 2) {
                      searchAircraftTypes(newInputValue);
                    }
                  }}
                  onChange={(event, newValue) => handleAircraftTypeSelect(newValue)}
                  loading={loadingAircraftTypes}
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
                      label="Search Aircraft Types"
                      fullWidth
                      helperText="Search by model, manufacturer or designator"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingAircraftTypes ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{ backgroundColor: 'white' }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  name="aircraft_model"
                  label="Model"
                  value={formData.aircraft_model}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!formData.aircraft_model}
                  sx={{ backgroundColor: 'white' }}
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
                  error={!formData.aircraft_manufacturer}
                  sx={{ backgroundColor: 'white' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  name="aircraft_category"
                  label="Category"
                  value={formData.aircraft_category}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="A">Airplane</MenuItem>
                  <MenuItem value="H">Helicopter</MenuItem>
                  <MenuItem value="G">Glider</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  name="aircraft_class"
                  label="Class"
                  value={formData.aircraft_class}
                  onChange={(e) => {
                    handleChange(e);
                    // Update engine type based on class - now in uppercase
                    setFormData(prev => ({
                      ...prev,
                      engine_type: e.target.value === 'S' ? 'SINGLE-ENGINE' : 'MULTI-ENGINE'
                    }));
                  }}
                  fullWidth
                  required
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="S">Single-Engine</MenuItem>
                  <MenuItem value="M">Multi-Engine</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="aircraft_designator"
                  label="Designator"
                  value={formData.aircraft_designator}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!formData.aircraft_designator}
                  sx={{ backgroundColor: 'white' }}
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
                  error={!formData.aircraft_wtc}
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="L">Light</MenuItem>
                  <MenuItem value="M">Medium</MenuItem>
                  <MenuItem value="H">Heavy</MenuItem>
                  <MenuItem value="J">Super</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Button
                    onClick={saveCustomAircraft}
                    variant="contained"
                    color="primary"
                  >
                    Save Aircraft
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </FormBox>
  );
};

export default AircraftSelector; 
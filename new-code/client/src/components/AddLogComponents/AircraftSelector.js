import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
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
import EditIcon from '@mui/icons-material/Edit';
import FormBox from './FormBox';
import config from '../../config';

const AircraftSelector = ({ formData, setFormData, setError }) => {
  const [aircraftFound, setAircraftFound] = useState(false);
  const [searchingAircraft, setSearchingAircraft] = useState(false);
  const [aircraftTypeOptions, setAircraftTypeOptions] = useState([]);
  const [loadingAircraftTypes, setLoadingAircraftTypes] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [originalAircraftData, setOriginalAircraftData] = useState(null);
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
        aircraft_category: 'A', // Default to Airplane
        aircraft_class: 'S', // Default to Single-Engine
        aircraft_id: null,
        is_new_aircraft: false,
        original_aircraft_data: null // Clear original data
      }));
    }
    
    // Cleanup function to clear timeout when component unmounts or effect reruns
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.aircraft_reg]);

  // Set showRegistrationForm based on aircraftFound
  useEffect(() => {
    if (!editMode) {
      setShowRegistrationForm(!aircraftFound);
    }
  }, [aircraftFound, editMode]);

  // Format aircraft registration (e.g., "vhtae" to "VH-TAE")
  const formatRegistration = (reg) => {
    if (!reg) return '';
    
    // Convert to uppercase
    reg = reg.toUpperCase();
    
    // If it already has a hyphen, preserve it
    if (reg.includes('-')) {
      return reg;
    }
    
    // Special case for Australian registrations
    if (reg.length >= 2 && reg.startsWith('VH')) {
      // If we have more than the "VH" prefix, add the hyphen
      if (reg.length > 2) {
        return `VH-${reg.substring(2)}`;
      }
      return reg; // Just return "VH" while typing
    }
    
    // Handle other country prefixes during typing
    const commonPrefixes = {
      'G': 'UK', // United Kingdom
      'D': 'Germany',
      'F': 'France',
      'N': 'USA', // Special case for N-numbers
      'EC': 'Spain',
      'ZS': 'South Africa',
      'JA': 'Japan',
      'PH': 'Netherlands',
      'SE': 'Sweden',
      'C': 'Canada',
      'LV': 'Argentina',
      'PP': 'Brazil'
    };
    
    // Check if the registration starts with any of our known prefixes
    for (const [prefix, country] of Object.entries(commonPrefixes)) {
      if (reg.startsWith(prefix) && reg.length > prefix.length) {
        // US registrations (N-numbers) don't use hyphens
        if (prefix === 'N' && /^N\d/.test(reg)) {
          return reg;
        }
        
        // For other countries, add hyphen after the prefix
        return `${prefix}-${reg.substring(prefix.length)}`;
      }
    }
    
    // If no specific formatting needed yet, return as is
    return reg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Apply formatting only to the aircraft registration field
    if (name === 'aircraft_reg') {
      const formattedValue = formatRegistration(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      
      // If the registration field is changed and not in edit mode, reset the aircraft found state
      if (!editMode) {
        setAircraftFound(false);
      }
    } else {
      // For other fields, just update normally without setting flags
      setFormData(prev => ({
        ...prev,
        [name]: value
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
      aircraft_wtc: selectedType.wtc || ''
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
        
        // Store the original aircraft data for comparison during form submission
        setOriginalAircraftData(aircraft);
        console.log('Found existing aircraft:', aircraft);
        
        // Determine the ID field based on what's available
        const aircraft_id = aircraft.aircraft_id || aircraft.user_aircraft_id || aircraft.id;
        
        setFormData(prev => ({
          ...prev,
          aircraft_id: aircraft_id, // Store the aircraft ID
          aircraft_model: aircraft.aircraft_model,
          aircraft_manufacturer: aircraft.aircraft_manufacturer,
          aircraft_designator: aircraft.aircraft_designator,
          aircraft_wtc: aircraft.aircraft_wtc,
          aircraft_category: aircraft.aircraft_category,
          aircraft_class: aircraft.aircraft_class,
          is_new_aircraft: false, // This is an existing aircraft
          original_aircraft_data: aircraft // Store original data in form state for comparison on submit
        }));
      } else {
        setAircraftFound(false);
        setOriginalAircraftData(null);
        // Clear aircraft fields when not found to ensure user enters new data
        setFormData(prev => ({
          ...prev,
          aircraft_id: null,
          aircraft_model: '',
          aircraft_manufacturer: '',
          aircraft_designator: '',
          aircraft_wtc: '',
          aircraft_category: 'A',
          aircraft_class: 'S',
          is_new_aircraft: true, // This will be a new aircraft when the form is submitted
          original_aircraft_data: null
        }));
      }
    } catch (error) {
      console.error('Error checking aircraft registration:', error);
      setAircraftFound(false);
      setOriginalAircraftData(null);
      // Clear aircraft fields on error
      setFormData(prev => ({
        ...prev,
        aircraft_id: null,
        aircraft_model: '',
        aircraft_manufacturer: '',
        aircraft_designator: '',
        aircraft_wtc: '',
        aircraft_category: 'A',
        aircraft_class: 'S',
        is_new_aircraft: true,
        original_aircraft_data: null
      }));
    } finally {
      setSearchingAircraft(false);
    }
  };

  const saveAircraftDetails = () => {
    // Validate aircraft fields
    if (!formData.aircraft_model || !formData.aircraft_manufacturer || 
        !formData.aircraft_designator || !formData.aircraft_wtc) {
      setError('Please fill in all aircraft fields');
      return false;
    }

    // No API call - just update the form state and UI
    if (editMode) {
      // If editing, update the form state with edited values
      setAircraftFound(true);
      setEditMode(false);
      setShowRegistrationForm(false);
      
      // Mark as new aircraft if it didn't exist in the database
      if (!originalAircraftData) {
        setFormData(prev => ({
          ...prev,
          is_new_aircraft: true
        }));
      }
    } else {
      // If adding new aircraft, update the form state and UI
      setFormData(prev => ({
        ...prev,
        is_new_aircraft: true
      }));
      setAircraftFound(true);
      setShowRegistrationForm(false);
    }
    
    return true;
  };

  const handleEditClick = () => {
    setShowRegistrationForm(true);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    if (originalAircraftData) {
      // Restore original data if it exists
      const aircraft_id = originalAircraftData.aircraft_id || 
                         originalAircraftData.user_aircraft_id || 
                         originalAircraftData.id;
      
      setFormData(prev => ({
        ...prev,
        aircraft_id: aircraft_id,
        aircraft_model: originalAircraftData.aircraft_model,
        aircraft_manufacturer: originalAircraftData.aircraft_manufacturer,
        aircraft_designator: originalAircraftData.aircraft_designator,
        aircraft_wtc: originalAircraftData.aircraft_wtc,
        aircraft_category: originalAircraftData.aircraft_category,
        aircraft_class: originalAircraftData.aircraft_class,
        is_new_aircraft: false
      }));
    } else if (aircraftFound) {
      // If aircraft was found but no original data, keep what's there
      setShowRegistrationForm(false);
    } else {
      // If new aircraft, clear the form
      setFormData(prev => ({
        ...prev,
        aircraft_model: '',
        aircraft_manufacturer: '',
        aircraft_designator: '',
        aircraft_wtc: '',
        aircraft_category: 'A',
        aircraft_class: 'S',
        is_new_aircraft: false
      }));
    }
    
    setEditMode(false);
    setShowRegistrationForm(!aircraftFound);
  };

  return (
    <FormBox 
      title="Aircraft" 
      icon={<AirplanemodeActiveIcon color="primary" />}
      action={aircraftFound && !showRegistrationForm && !editMode ? (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleEditClick}
          size="small"
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
      ) : editMode ? (
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleCancelEdit}
          size="small"
        >
          Cancel
        </Button>
      ) : null}
    >
      <Grid container spacing={2}>
        {/* Registration input - show when adding new or not found */}
        {showRegistrationForm && !editMode && (
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              name="aircraft_reg"
              label="Registration"
              sx={{ backgroundColor: 'white' }}
              value={formData.aircraft_reg}
              onChange={handleChange}
              fullWidth
              required
              helperText={searchingAircraft ? "Checking registration..." : ""}
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
        )}

        {/* Registration display - show when aircraft found and not editing */}
        {aircraftFound && !showRegistrationForm && !editMode && (
          <Grid item xs={12}>
            {/* Table to display aircraft details */}
            <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>Registration:</TableCell>
                    <TableCell>
                      {formData.aircraft_reg}
                      {formData.is_new_aircraft && (
                        <Box sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>
                          (New aircraft will be saved when submitting the log)
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Category:</TableCell>
                    <TableCell>{formData.aircraft_category === 'A' ? 'Airplane' : formData.aircraft_category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Model:</TableCell>
                    <TableCell>{formData.aircraft_model}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Manufacturer:</TableCell>
                    <TableCell>{formData.aircraft_manufacturer}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Class:</TableCell>
                    <TableCell>{formData.aircraft_class === 'S' ? 'Single-Engine' : 'Multi-Engine'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>WTC:</TableCell>
                    <TableCell>{formData.aircraft_wtc}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {/* Edit form - show when in edit mode */}
        {editMode && (
          <Grid item xs={12}>
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
                    />
                  )}
                />
              </Grid>

              {/* Registration Edit */}
              <Grid item xs={12}>
                <TextField
                  name="aircraft_reg"
                  label="Registration"
                  value={formData.aircraft_reg}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!formData.aircraft_reg}
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
                  onChange={handleChange}
                  fullWidth
                  required
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
                    onClick={saveAircraftDetails}
                    variant="contained"
                    color="primary"
                  >
                    {originalAircraftData ? 'Save Changes' : 'Use Aircraft'}
                  </Button>
                  <Alert severity="info" sx={{ ml: 2, flex: 1 }}>
                    Aircraft changes will be saved when you submit the log.
                  </Alert>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* New aircraft form - show when aircraft not found and not in edit mode */}
        {!aircraftFound && !searchingAircraft && formData.aircraft_reg && !editMode && (
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
                  onChange={handleChange}
                  fullWidth
                  required
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
                    onClick={saveAircraftDetails}
                    variant="contained"
                    color="primary"
                  >
                    Use Aircraft
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
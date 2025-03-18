import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

// Import helper function to invalidate cache
const invalidateLogbookCache = (userId = 1) => {
  localStorage.removeItem(`logbook_entries_${userId}`);
  localStorage.removeItem(`processed_entries_${userId}`);
  localStorage.removeItem(`airport_data_${userId}`);
  localStorage.removeItem(`logbook_cache_timestamp_${userId}`);
  console.log('Logbook cache invalidated');
};

function AddLog() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
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

  // Check if we're in edit mode with pre-filled data
  useEffect(() => {
    if (location.state?.editData) {
      const editData = location.state.editData;
      console.log('Editing existing log entry:', editData);
      setIsEditMode(true);
      
      // Format and prepare the data before setting it
      const preparedEditData = {
        ...editData,
        // Ensure date is in the proper format YYYY-MM-DD for the date input
        flight_date: editData.flight_date ? editData.flight_date.substring(0, 10) : '',
        // Ensure route_data is properly structured
        route_data: Array.isArray(editData.route_data) ? editData.route_data : 
          // If it's a string (from JSON), parse it
          (typeof editData.route_data === 'string' ? 
            JSON.parse(editData.route_data) : 
            // Default empty route if nothing is available
            [
              { type: 'departure', airport_id: null, airport_data: null, is_custom: false, custom_name: null },
              { type: 'arrival', airport_id: null, airport_data: null, is_custom: false, custom_name: null }
            ]
          )
      };
      
      console.log('Prepared edit data:', preparedEditData);
      
      // Fetch more details about the aircraft to get original_aircraft_data
      const fetchAircraftDetails = async () => {
        try {
          if (editData.aircraft_reg) {
            const response = await axios.get(
              `${config.apiUrl}/api/user-aircraft/1/registration/${editData.aircraft_reg}`
            );
            
            if (response.data.found) {
              const aircraftDetails = response.data.aircraft;
              
              // Set form data with all the edit data and the original aircraft data
              setFormData({
                ...preparedEditData,
                original_aircraft_data: aircraftDetails
              });
            } else {
              // If aircraft not found (unusual case), just populate with edit data
              setFormData(preparedEditData);
            }
          }
        } catch (error) {
          console.error('Error fetching aircraft details:', error);
          // Still set the form data even if the aircraft lookup fails
          setFormData(preparedEditData);
        }
      };
      
      fetchAircraftDetails();
    }
  }, [location.state]);

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
      // Helper function to check if aircraft has been modified
      const isAircraftModified = (current, original) => {
        if (!original) return false; // If no original, it's a new aircraft, not a modified one
        
        // Compare fields that might have been modified
        return String(current.aircraft_model) !== String(original.aircraft_model) ||
               String(current.aircraft_manufacturer) !== String(original.aircraft_manufacturer) ||
               String(current.aircraft_designator) !== String(original.aircraft_designator) ||
               String(current.aircraft_wtc) !== String(original.aircraft_wtc) ||
               String(current.aircraft_category) !== String(original.aircraft_category) ||
               String(current.aircraft_class) !== String(original.aircraft_class);
      };

      console.log('Form data before submission:', formData);
      console.log('Is new aircraft?', formData.is_new_aircraft);
      console.log('Original aircraft data:', formData.original_aircraft_data);
      
      const isNewAircraft = formData.is_new_aircraft === true;
      const hasBeenModified = isAircraftModified(formData, formData.original_aircraft_data);
      
      console.log('Aircraft has been modified?', hasBeenModified);
      
      // Handle aircraft database operations
      if (isNewAircraft) {
        // Create new aircraft record
        console.log('Creating new aircraft:', formData.aircraft_reg);
        try {
          const response = await axios.post(`${config.apiUrl}/api/user-aircraft`, {
            userId: 1, // TODO: Replace with actual user ID from auth system
            aircraft_reg: formData.aircraft_reg,
            aircraft_designator: formData.aircraft_designator,
            aircraft_manufacturer: formData.aircraft_manufacturer,
            aircraft_model: formData.aircraft_model,
            aircraft_wtc: formData.aircraft_wtc,
            aircraft_category: formData.aircraft_category,
            aircraft_class: formData.aircraft_class
          });
          console.log('New aircraft created successfully:', response.data);
          
          // Update formData with the created aircraft ID
          formData.aircraft_id = response.data.id || response.data.aircraft_id || response.data.user_aircraft_id;
        } catch (aircraftError) {
          console.error('Error creating aircraft:', aircraftError);
          setError('Error creating aircraft. Please check the aircraft details and try again.');
          return; // Stop the form submission if aircraft creation fails
        }
      } else if (hasBeenModified) {
        // Update existing aircraft
        console.log('Updating existing aircraft:', formData.aircraft_reg);
        try {
          const response = await axios.put(`${config.apiUrl}/api/user-aircraft/${1}/${formData.aircraft_reg}`, {
            userId: 1, // TODO: Replace with actual user ID from auth system
            aircraft_designator: formData.aircraft_designator,
            aircraft_manufacturer: formData.aircraft_manufacturer,
            aircraft_model: formData.aircraft_model,
            aircraft_wtc: formData.aircraft_wtc,
            aircraft_category: formData.aircraft_category,
            aircraft_class: formData.aircraft_class
          });
          console.log('Aircraft updated successfully:', response.data);
        } catch (updateError) {
          console.error('Error updating aircraft:', updateError);
          setError('Error updating aircraft. Your log will still be saved, but the aircraft details may not be updated.');
          // Continue with form submission - don't return
        }
      } else {
        console.log('Using existing aircraft without modifications');
      }

      // Continue with log submission
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

      // Remove fields that shouldn't be sent to the server
      delete processedData.original_aircraft_data;
      delete processedData.is_new_aircraft;

      numericFields.forEach(field => {
        processedData[field] = parseFloat(formData[field]) || 0;
      });
      
      console.log('Processed data for submission:', processedData);

      // If in edit mode, update the existing log entry
      if (isEditMode && formData.id) {
        await axios.put(`${config.apiUrl}/api/logbook/${formData.id}`, processedData);
        console.log('Log entry updated successfully');
      } else {
        // Otherwise create a new log entry
        await axios.post(`${config.apiUrl}/api/logbook`, processedData);
        console.log('New log entry created successfully');
      }
      
      // Invalidate the cache to ensure fresh data is loaded in the logbook
      invalidateLogbookCache();
      
      navigate('/logbook');
    } catch (err) {
      setError(`Error ${isEditMode ? 'updating' : 'adding'} logbook entry. Please try again.`);
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
          {isEditMode ? 'Edit Log Entry' : 'Add Log'}
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
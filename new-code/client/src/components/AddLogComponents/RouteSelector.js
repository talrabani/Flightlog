import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  IconButton,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FormBox from './FormBox';
import config from '../../config';

const RouteSelector = ({ formData, setFormData }) => {
  const [airportOptions, setAirportOptions] = useState([]);
  const [loadingAirports, setLoadingAirports] = useState({});

  // Fetch airport details when the route data is loaded from an existing entry
  useEffect(() => {
    const fetchExistingAirports = async () => {
      // Check if we have route data with airport IDs but no airport data (common when editing)
      const routeStopsNeedingData = formData.route_data.filter(
        stop => stop.airport_id && !stop.airport_data && !stop.is_custom
      );
      
      if (routeStopsNeedingData.length === 0) return;
      
      // Get unique airport IDs to fetch
      const airportIds = [...new Set(routeStopsNeedingData.map(stop => stop.airport_id))];
      console.log('Fetching details for airports:', airportIds);
      
      try {
        const airportDetailsMap = {};
        
        // Fetch details for each airport individually since we don't know if batch endpoint is available
        for (const airportId of airportIds) {
          setLoadingAirports(prev => ({ ...prev, [airportId]: true }));
          
          try {
            const response = await axios.get(`${config.apiUrl}/api/airports/${airportId}`);
            airportDetailsMap[airportId] = response.data;
          } catch (err) {
            console.error(`Error fetching airport ${airportId}:`, err);
          } finally {
            setLoadingAirports(prev => ({ ...prev, [airportId]: false }));
          }
        }
        
        // Update route data with fetched airport details
        if (Object.keys(airportDetailsMap).length > 0) {
          setFormData(prev => ({
            ...prev,
            route_data: prev.route_data.map(stop => {
              if (stop.airport_id && !stop.airport_data && airportDetailsMap[stop.airport_id]) {
                return {
                  ...stop,
                  airport_data: airportDetailsMap[stop.airport_id]
                };
              }
              return stop;
            })
          }));
        }
      } catch (error) {
        console.error('Error fetching airport details:', error);
      }
    };
    
    fetchExistingAirports();
  }, [formData.route_data, setFormData]);

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

  return (
    <FormBox title="Routes" icon={<FlightTakeoffIcon color="primary" />}>
      {formData.route_data.map((stop, index) => (
        <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Autocomplete
            options={airportOptions}
            getOptionLabel={(option) => 
              option ? `${option.icao || ''} - ${option.airport_name || ''}` : ''
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
                  <strong>{option.icao || option.iata || ''}</strong> - {option.airport_name || ''}
                </Typography>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ backgroundColor: 'white' }}
                label={
                  index === 0 ? "Departure Airport" :
                  index === formData.route_data.length - 1 ? "Arrival Airport" :
                  `Stop ${index}`
                }
                required
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingAirports[stop.airport_id] ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
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
    </FormBox>
  );
};

export default RouteSelector; 
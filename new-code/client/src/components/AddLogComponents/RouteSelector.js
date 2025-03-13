import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FormBox from './FormBox';
import config from '../../config';

const RouteSelector = ({ formData, setFormData }) => {
  const [airportOptions, setAirportOptions] = useState([]);

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
                sx={{ backgroundColor: 'white' }}
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
    </FormBox>
  );
};

export default RouteSelector; 
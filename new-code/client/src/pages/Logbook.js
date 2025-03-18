import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import TableChartIcon from '@mui/icons-material/TableChart';
import config from '../config';

// Import the table components
import LogbookTableModern from '../components/LogbookComponents/LogbookTableModern';
import LogbookTableClassic from '../components/LogbookComponents/LogbookTableClassic';

function Logbook() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [processedEntries, setProcessedEntries] = useState([]);
  const [viewMode, setViewMode] = useState('classic'); // 'modern' or 'classic'
  const [airportData, setAirportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState({});

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    // Clear selections when exiting selection mode
    if (selectionMode) {
      setSelectedEntries({});
    }
  };

  // Handle row selection
  const handleRowSelect = (id, isSelected) => {
    setSelectedEntries(prev => ({
      ...prev,
      [id]: isSelected
    }));
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    const newSelectedEntries = {};
    if (isSelected) {
      processedEntries.forEach(entry => {
        newSelectedEntries[entry.id] = true;
      });
    }
    setSelectedEntries(newSelectedEntries);
  };
  
  // Handle row double-click for editing
  const handleRowDoubleClick = (entry) => {
    console.log('Double-clicked entry:', entry);
    
    // Prepare the entry data for editing
    const editData = {
      id: entry.id,
      flight_date: entry.flight_date,
      aircraft_reg: entry.aircraft_reg,
      aircraft_model: entry.aircraft_model,
      aircraft_manufacturer: entry.aircraft_manufacturer,
      aircraft_designator: entry.aircraft_designator,
      aircraft_wtc: entry.aircraft_wtc,
      aircraft_category: entry.aircraft_category,
      aircraft_class: entry.aircraft_class,
      aircraft_id: entry.aircraft_id,
      
      pilot_in_command: entry.pilot_in_command,
      other_crew: entry.other_crew,
      route_data: entry.route_data,
      details: entry.details,
      flight_type: entry.flight_type,
      flight_rule: entry.flight_rule,
      
      // Flight hours
      icus_day: entry.icus_day,
      icus_night: entry.icus_night,
      dual_day: entry.dual_day,
      dual_night: entry.dual_night,
      command_day: entry.command_day,
      command_night: entry.command_night,
      co_pilot_day: entry.co_pilot_day,
      co_pilot_night: entry.co_pilot_night,
      instrument_flight: entry.instrument_flight,
      instrument_sim: entry.instrument_sim
    };
    
    // Navigate to AddLog with state containing the entry data
    navigate('/addlog', { state: { editData } });
  };

  // Fetch airport data for the given IDs
  const fetchAirportData = async (airportIds) => {
    try {
      const response = await axios.post(`${config.apiUrl}/api/airports/batch`, { ids: airportIds });
      console.log("Batch airport data:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching airport data:', error);
      return {};
    }
  };

  // Process the raw logbook data
  const processLogbookData = (data, airports) => {
    return data.map(entry => {
      
      // Create a new object to avoid mutating the original
      const processedEntry = { ...entry };

      // 1. Format aircraft name: aircraft_model, aircraft_manufacturer.toUpper()
      if (processedEntry.aircraft_manufacturer) {
        processedEntry.aircraft_name = `${processedEntry.aircraft_model}, ${processedEntry.aircraft_manufacturer.toUpperCase()}`;
      } else {
        processedEntry.aircraft_name = processedEntry.aircraft_model;
      }

      // 2. Process route data to show ICAO codes or names separated by '-'
      if (processedEntry.route_data && Array.isArray(processedEntry.route_data)) {
        processedEntry.formatted_route = processedEntry.route_data.map(stop => {
          if (stop.is_custom) {
            return stop.custom_name;
          }
          
          // Use the airport data from our fetched map
          const airport = airports[stop.airport_id];
          if (airport) {
            // Use ICAO if available, otherwise use name
            return airport.icao || airport.airport_name || airport.iata || '';
          }
          
          return '';
        }).filter(Boolean).join('-');
      } else {
        processedEntry.formatted_route = '';
      }

      // 3. Allocate hours based on engine type
      // Initialize all engine-specific fields to 0
      processedEntry.single_engine_icus_day = 0;
      processedEntry.single_engine_icus_night = 0;
      processedEntry.single_engine_dual_day = 0;
      processedEntry.single_engine_dual_night = 0;
      processedEntry.single_engine_command_day = 0;
      processedEntry.single_engine_command_night = 0;
      
      processedEntry.multi_engine_icus_day = 0;
      processedEntry.multi_engine_icus_night = 0;
      processedEntry.multi_engine_dual_day = 0;
      processedEntry.multi_engine_dual_night = 0;
      processedEntry.multi_engine_command_day = 0;
      processedEntry.multi_engine_command_night = 0;

      // Determine if aircraft is single or multi-engine based on aircraft_class
      const isMultiEngine = processedEntry.aircraft_class === 'M';
      const isSingleEngine = processedEntry.aircraft_class === 'S';

      console.log(`Aircraft ${processedEntry.aircraft_reg} class: ${processedEntry.aircraft_class}, isMultiEngine: ${isMultiEngine}, isSingleEngine: ${isSingleEngine}`);

      // Helper function to convert string hours to numbers
      const parseHours = (value) => {
        if (value === null || value === undefined) return 0;
        // Convert string to number, handle both "1.0" and 1.0 formats
        return typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
      };

      // Allocate hours based on determined engine type
      if (isMultiEngine) {
        // Multi engine
        processedEntry.multi_engine_icus_day = parseHours(processedEntry.icus_day);
        processedEntry.multi_engine_icus_night = parseHours(processedEntry.icus_night);
        processedEntry.multi_engine_dual_day = parseHours(processedEntry.dual_day);
        processedEntry.multi_engine_dual_night = parseHours(processedEntry.dual_night);
        processedEntry.multi_engine_command_day = parseHours(processedEntry.command_day);
        processedEntry.multi_engine_command_night = parseHours(processedEntry.command_night);
      } else {
        // Single engine (default if not explicitly multi-engine)
        processedEntry.single_engine_icus_day = parseHours(processedEntry.icus_day);
        processedEntry.single_engine_icus_night = parseHours(processedEntry.icus_night);
        processedEntry.single_engine_dual_day = parseHours(processedEntry.dual_day);
        processedEntry.single_engine_dual_night = parseHours(processedEntry.dual_night);
        processedEntry.single_engine_command_day = parseHours(processedEntry.command_day);
        processedEntry.single_engine_command_night = parseHours(processedEntry.command_night);
      }

      return processedEntry;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch logbook entries
        const response = await axios.get(`${config.apiUrl}/api/logbook/1`);
        setEntries(response.data);
        
        // Extract all unique airport IDs from route data
        const airportIds = new Set();
        response.data.forEach(entry => {
          if (entry.route_data && Array.isArray(entry.route_data)) {
            entry.route_data.forEach(stop => {
              if (stop.airport_id) {
                airportIds.add(stop.airport_id);
              }
            });
          }
        });
        
        // Fetch airport data if we have any airport IDs
        let airports = {};
        if (airportIds.size > 0) {
          airports = await fetchAirportData(Array.from(airportIds));
          setAirportData(airports);
        }
        
        // Process the data with the fetched airport information
        const processed = processLogbookData(response.data, airports);
        setProcessedEntries(processed);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: 2 }}>
      <Box sx={{ my: 4, width: '100%' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Flight Logbook
          </Typography>
        </Box>
        
        {/* View Toggle */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body1">View:</Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="logbook view mode"
          >
            <ToggleButton value="modern" aria-label="modern view">
              <ViewListIcon sx={{ mr: 1 }} />
              Modern
            </ToggleButton>
            <ToggleButton value="classic" aria-label="classic view">
              <TableChartIcon sx={{ mr: 1 }} />
              Classic
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/addlog')}
          >
            Add Entry
          </Button>
          <Button
            variant={selectionMode ? "contained" : "outlined"}
            color="primary"
            onClick={toggleSelectionMode}
          >
            {selectionMode ? "Cancel Selection" : "Select"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={!selectionMode || Object.keys(selectedEntries).length === 0}
          >
            Export
          </Button>
        </Box>
        
        {/* Render the appropriate table based on the view mode */}
        {loading ? (
          <Typography>Loading logbook entries...</Typography>
        ) : (
          viewMode === 'modern' ? (
            <LogbookTableModern 
              entries={processedEntries} 
              selectionMode={selectionMode}
              selectedEntries={selectedEntries}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onRowDoubleClick={handleRowDoubleClick}
            />
          ) : (
            <LogbookTableClassic 
              entries={processedEntries} 
              selectionMode={selectionMode}
              selectedEntries={selectedEntries}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onRowDoubleClick={handleRowDoubleClick}
            />
          )
        )}
      </Box>
    </Container>
  );
}

export default Logbook; 
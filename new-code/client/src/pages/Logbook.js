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
  const [viewMode, setViewMode] = useState('modern'); // 'modern' or 'classic'

  // Process the raw logbook data
  const processLogbookData = (data) => {
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
          
          if (stop.airport_data) {
            // Use ICAO if available, otherwise use name
            return stop.airport_data.icao || stop.airport_data.name || stop.airport_data.iata || '';
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
      const isMultiEngine = processedEntry.aircraft_class && processedEntry.aircraft_class === 'M';

      // Allocate hours based on determined engine type
      if (!isMultiEngine) {
        // Single engine (default if not explicitly multi-engine)
        processedEntry.single_engine_icus_day = processedEntry.icus_day || 0;
        processedEntry.single_engine_icus_night = processedEntry.icus_night || 0;
        processedEntry.single_engine_dual_day = processedEntry.dual_day || 0;
        processedEntry.single_engine_dual_night = processedEntry.dual_night || 0;
        processedEntry.single_engine_command_day = processedEntry.command_day || 0;
        processedEntry.single_engine_command_night = processedEntry.command_night || 0;
      } else {
        // Multi engine
        processedEntry.multi_engine_icus_day = processedEntry.icus_day || 0;
        processedEntry.multi_engine_icus_night = processedEntry.icus_night || 0;
        processedEntry.multi_engine_dual_day = processedEntry.dual_day || 0;
        processedEntry.multi_engine_dual_night = processedEntry.dual_night || 0;
        processedEntry.multi_engine_command_day = processedEntry.command_day || 0;
        processedEntry.multi_engine_command_night = processedEntry.command_night || 0;
      }

      return processedEntry;
    });
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/logbook/1`);
        setEntries(response.data);
        
        // Process the data
        const processed = processLogbookData(response.data);
        setProcessedEntries(processed);
      } catch (error) {
        console.error('Error fetching logbook entries:', error);
      }
    };

    fetchEntries();
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: 2 }}>
      <Box sx={{ my: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Flight Logbook
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/addlog')}
          >
            Add Entry
          </Button>
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
        
        {/* Render the appropriate table based on the view mode */}
        {viewMode === 'modern' ? (
          <LogbookTableModern entries={processedEntries} />
        ) : (
          <LogbookTableClassic entries={processedEntries} />
        )}
      </Box>
    </Container>
  );
}

export default Logbook; 
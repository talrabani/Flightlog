import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import RefreshIcon from '@mui/icons-material/Refresh';
import config from '../config';

// Import custom hook for caching
import useLogbookCache from '../hooks/useLogbookCache';

// Import the table components
import LogbookTableModern from '../components/LogbookComponents/LogbookTableModern';
import LogbookTableClassic from '../components/LogbookComponents/LogbookTableClassic';

function Logbook() {
  const navigate = useNavigate();
  
  // Use our custom hook for caching logbook data
  const { 
    processedEntries, 
    loading, 
    refreshData 
  } = useLogbookCache();
  
  const [viewMode, setViewMode] = useState('classic'); // 'modern' or 'classic'
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState({});

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => {
      // Clear selections when exiting selection mode
      if (prev) {
        setSelectedEntries({});
      }
      return !prev;
    });
  }, []);

  // Handle row selection - memoized to prevent unnecessary re-renders
  const handleRowSelect = useCallback((id, isSelected) => {
    setSelectedEntries(prev => ({
      ...prev,
      [id]: isSelected
    }));
  }, []);

  // Handle select all - memoized to prevent unnecessary re-renders
  const handleSelectAll = useCallback((isSelected) => {
    if (isSelected) {
      const newSelectedEntries = {};
      processedEntries.forEach(entry => {
        newSelectedEntries[entry.id] = true;
      });
      setSelectedEntries(newSelectedEntries);
    } else {
      setSelectedEntries({});
    }
  }, [processedEntries]);
  
  // Handle row double-click for editing - memoized to prevent unnecessary re-renders
  const handleRowDoubleClick = useCallback((entry) => {
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
  }, [navigate]);

  // Memoize the view change handler to prevent unnecessary re-renders
  const handleViewChange = useCallback((event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  }, []);

  // Memoize the selection status to improve performance
  const selectionStatus = useMemo(() => {
    const selectedCount = Object.keys(selectedEntries).length;
    const isAllSelected = processedEntries.length > 0 && 
      processedEntries.every(entry => selectedEntries[entry.id]);
    
    return {
      selectedCount,
      isAllSelected,
      hasSelections: selectedCount > 0
    };
  }, [selectedEntries, processedEntries]);

  // Memoize the table component based on view mode to prevent unnecessary re-renders
  const currentTable = useMemo(() => {
    if (loading) {
      return <Typography>Loading logbook entries...</Typography>;
    }
    
    if (viewMode === 'modern') {
      return (
        <LogbookTableModern 
          entries={processedEntries}
          selectionMode={selectionMode}
          selectedEntries={selectedEntries}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          onRowDoubleClick={handleRowDoubleClick}
        />
      );
    } else {
      return (
        <LogbookTableClassic 
          entries={processedEntries}
          selectionMode={selectionMode}
          selectedEntries={selectedEntries}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          onRowDoubleClick={handleRowDoubleClick}
        />
      );
    }
  }, [
    loading, 
    viewMode, 
    processedEntries, 
    selectionMode, 
    selectedEntries, 
    handleRowSelect, 
    handleSelectAll, 
    handleRowDoubleClick
  ]);

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
            disabled={!selectionMode || !selectionStatus.hasSelections}
          >
            Export {selectionStatus.selectedCount > 0 ? `(${selectionStatus.selectedCount})` : ''}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={refreshData}
          >
            Refresh
          </Button>
        </Box>
        
        {/* Render the appropriate table based on the view mode */}
        {currentTable}
      </Box>
    </Container>
  );
}

export default Logbook; 
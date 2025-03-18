import React, { useMemo, memo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Checkbox cell
const CheckboxCell = styled(TableCell)(({ theme }) => ({
  padding: '0 4px',
  width: '40px'
}));

// Styled row with hover effect
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    cursor: 'pointer'
  }
}));

// Memoized table row component to prevent unnecessary re-renders
const MemoizedTableRow = memo(({ 
  entry, 
  columns, 
  isSelected, 
  selectionMode, 
  onRowDoubleClick, 
  onCheckboxClick 
}) => {
  // Optimize the double-click handler with useCallback
  const handleDoubleClick = useCallback(() => {
    onRowDoubleClick(entry);
  }, [entry, onRowDoubleClick]);
  
  // Optimize the checkbox click handler with useCallback
  const handleCheckbox = useCallback((event) => {
    onCheckboxClick(event, entry.id);
  }, [entry.id, onCheckboxClick]);
  
  // Handle row click with double-click detection
  const handleRowClick = useCallback((e) => {
    if (e.detail === 2) {
      handleDoubleClick();
    }
  }, [handleDoubleClick]);
  
  return (
    <StyledTableRow 
      onClick={handleRowClick}
      sx={isSelected ? { backgroundColor: 'rgba(0, 0, 0, 0.2)' } : {}}
    >
      {selectionMode && (
        <CheckboxCell>
          <Checkbox
            checked={isSelected}
            onChange={handleCheckbox}
            inputProps={{ 'aria-labelledby': `entry-${entry.id}` }}
            size="small"
          />
        </CheckboxCell>
      )}
      {columns.map((column) => (
        <TableCell key={column.field}>
          {column.valueGetter 
            ? column.valueGetter({ row: entry }) 
            : column.valueFormatter 
              ? column.valueFormatter({ value: entry[column.field] }) 
              : entry[column.field]}
        </TableCell>
      ))}
    </StyledTableRow>
  );
});

// Set display name for debugging
MemoizedTableRow.displayName = 'MemoizedTableRow';

const LogbookTableModern = ({ 
  entries,
  selectionMode = false, 
  selectedEntries = {}, 
  onRowSelect = () => {}, 
  onSelectAll = () => {},
  onRowDoubleClick = () => {} 
}) => {
  // Handle select all checkbox change
  const handleSelectAllClick = useCallback((event) => {
    onSelectAll(event.target.checked);
  }, [onSelectAll]);

  // Handle individual checkbox change
  const handleCheckboxClick = useCallback((event, id) => {
    event.stopPropagation(); // Prevent row click event
    onRowSelect(id, event.target.checked);
  }, [onRowSelect]);

  // Calculate if all entries are selected - memoized
  const isAllSelected = useMemo(() => {
    return entries.length > 0 && entries.every(entry => selectedEntries[entry.id]);
  }, [entries, selectedEntries]);

  // Memoize the columns definition to prevent re-creation on every render
  const columns = useMemo(() => [
    {
      field: 'flight_date',
      headerName: 'Date',
      width: 110,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      field: 'aircraft_info',
      headerName: 'Aircraft',
      width: 200,
      valueGetter: (params) => {
        return params.row.aircraft_name || `${params.row.aircraft_model} (${params.row.aircraft_reg})`;
      }
    },
    {
      field: 'route',
      headerName: 'Route',
      width: 150,
      valueGetter: (params) => {
        if (params.row.formatted_route) {
          return params.row.formatted_route;
        }
        
        const routeData = params.row.route_data || [];
        if (!routeData.length) return '';
        
        const airports = routeData.map(stop => {
          if (stop.is_custom) return stop.custom_name;
          return stop.airport_data ? stop.airport_data.icao || stop.airport_data.iata : '';
        });
        
        return airports.join(' → ');
      }
    },
    {
      field: 'total_time',
      headerName: 'Total Time',
      width: 100,
      valueGetter: (params) => {
        // Calculate total time from all fields
        const singleEngineTime = (
          (parseFloat(params.row.single_engine_icus_day) || 0) +
          (parseFloat(params.row.single_engine_icus_night) || 0) +
          (parseFloat(params.row.single_engine_dual_day) || 0) +
          (parseFloat(params.row.single_engine_dual_night) || 0) +
          (parseFloat(params.row.single_engine_command_day) || 0) +
          (parseFloat(params.row.single_engine_command_night) || 0)
        );
        
        const multiEngineTime = (
          (parseFloat(params.row.multi_engine_icus_day) || 0) +
          (parseFloat(params.row.multi_engine_icus_night) || 0) +
          (parseFloat(params.row.multi_engine_dual_day) || 0) +
          (parseFloat(params.row.multi_engine_dual_night) || 0) +
          (parseFloat(params.row.multi_engine_command_day) || 0) +
          (parseFloat(params.row.multi_engine_command_night) || 0)
        );
        
        const coPilotTime = (
          (parseFloat(params.row.co_pilot_day) || 0) +
          (parseFloat(params.row.co_pilot_night) || 0)
        );
        
        const instrumentTime = (
          (parseFloat(params.row.instrument_flight) || 0) +
          (parseFloat(params.row.instrument_sim) || 0)
        );
        
        return (singleEngineTime + multiEngineTime + coPilotTime).toFixed(1);
      }
    },
    {
      field: 'day',
      headerName: 'Day',
      width: 100,
      valueGetter: (params) => {
        // Calculate total day time
        const dayTime = (
          (parseFloat(params.row.single_engine_icus_day) || 0) +
          (parseFloat(params.row.single_engine_dual_day) || 0) +
          (parseFloat(params.row.single_engine_command_day) || 0) +
          (parseFloat(params.row.multi_engine_icus_day) || 0) +
          (parseFloat(params.row.multi_engine_dual_day) || 0) +
          (parseFloat(params.row.multi_engine_command_day) || 0) +
          (parseFloat(params.row.co_pilot_day) || 0)
        );
        
        return dayTime.toFixed(1);
      }
    },
    {
      field: 'night',
      headerName: 'Night',
      width: 100,
      valueGetter: (params) => {
        // Calculate total night time
        const nightTime = (
          (parseFloat(params.row.single_engine_icus_night) || 0) +
          (parseFloat(params.row.single_engine_dual_night) || 0) +
          (parseFloat(params.row.single_engine_command_night) || 0) +
          (parseFloat(params.row.multi_engine_icus_night) || 0) +
          (parseFloat(params.row.multi_engine_dual_night) || 0) +
          (parseFloat(params.row.multi_engine_command_night) || 0) +
          (parseFloat(params.row.co_pilot_night) || 0)
        );
        
        return nightTime.toFixed(1);
      }
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      width: 100,
      valueGetter: (params) => {
        // Calculate total instrument time
        const instrumentTime = (
          (parseFloat(params.row.instrument_flight) || 0) +
          (parseFloat(params.row.instrument_sim) || 0)
        );
        
        return instrumentTime.toFixed(1);
      }
    },
  ], []);

  // Memoize the table header to prevent re-rendering when only data changes
  const tableHeader = useMemo(() => (
    <TableHead>
      <TableRow>
        {selectionMode && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={Object.keys(selectedEntries).length > 0 && !isAllSelected}
              checked={isAllSelected}
              onChange={handleSelectAllClick}
              inputProps={{ 'aria-label': 'select all entries' }}
              size="small"
            />
          </TableCell>
        )}
        {columns.map((column) => (
          <TableCell key={column.field}>{column.headerName}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), [columns, handleSelectAllClick, isAllSelected, selectedEntries, selectionMode]);

  return (
    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Table sx={{ width: '100%' }} aria-label="flight logbook">
        {tableHeader}
        <TableBody>
          {entries.map((entry) => (
            <MemoizedTableRow
              key={entry.id}
              entry={entry}
              columns={columns}
              isSelected={!!selectedEntries[entry.id]}
              selectionMode={selectionMode}
              onRowDoubleClick={onRowDoubleClick}
              onCheckboxClick={handleCheckboxClick}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Export the component wrapped in memo for additional optimization
export default memo(LogbookTableModern);

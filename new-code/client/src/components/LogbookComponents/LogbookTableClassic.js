import React, { useMemo, memo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Checkbox
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Custom styled table cells for the classic logbook layout
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '4px 8px',
  fontSize: '0.75rem',
  border: '1px solid rgba(224, 224, 224, 1)',
  textAlign: 'center',
  whiteSpace: 'nowrap'
}));

// Cell that allows text wrapping
const WrappingCell = styled(StyledTableCell)(({ theme }) => ({
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  minWidth: '100px',
  maxWidth: '150px'
}));

const WrappingCellThickRightBorder = styled(WrappingCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

const HeaderCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  fontWeight: 'bold',
  fontSize: '0.7rem'
}));

const GroupHeaderCell = styled(HeaderCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200]
}));

// Cells with thick right border
const ThickRightBorderCell = styled(StyledTableCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

const ThickRightBorderHeaderCell = styled(HeaderCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

const ThickRightBorderGroupHeaderCell = styled(GroupHeaderCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Night cells with blue background
const NightCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#a8d1f0',
  padding: '4px 8px',
  fontSize: '0.75rem',
  border: '1px solid rgba(224, 224, 224, 1)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  width: '40px'
}));

// Day cells with fixed width
const DayCell = styled(StyledTableCell)(({ theme }) => ({
  width: '40px'
}));

// Night cells with thick right border
const NightThickRightBorderCell = styled(NightCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Instrument sim cell with orange background
const SimCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#f0c8a8',
  padding: '4px 8px',
  fontSize: '0.75rem',
  border: '1px solid rgba(224, 224, 224, 1)',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  width: '40px'
}));

// Vertical text header cells
const VerticalHeaderCell = styled(HeaderCell)(({ theme }) => ({
  height: '80px',
  width: '40px',
  padding: '4px 0',
  '& .MuiBox-root': {
    transform: 'rotate(-90deg)',
    whiteSpace: 'nowrap',
    width: '20px',
    transformOrigin: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

// Vertical text header cells with blue background
const VerticalNightHeaderCell = styled(VerticalHeaderCell)(({ theme }) => ({
  backgroundColor: '#a8d1f0'
}));

// Vertical text header cells with thick right border
const VerticalThickRightBorderHeaderCell = styled(VerticalHeaderCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Vertical text header cells with blue background and thick right border
const VerticalNightThickRightBorderHeaderCell = styled(VerticalNightHeaderCell)(({ theme }) => ({
  borderRight: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Vertical text header cells with orange background
const VerticalSimHeaderCell = styled(VerticalHeaderCell)(({ theme }) => ({
  backgroundColor: '#f0c8a8'
}));

// Bottom row header cells with thick bottom border
const BottomRowHeaderCell = styled(VerticalHeaderCell)(({ theme }) => ({
  borderBottom: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Bottom row night header cells with thick bottom border
const BottomRowNightHeaderCell = styled(VerticalNightHeaderCell)(({ theme }) => ({
  borderBottom: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Bottom row night header cells with thick right and bottom border
const BottomRowNightThickRightBorderHeaderCell = styled(VerticalNightThickRightBorderHeaderCell)(({ theme }) => ({
  borderBottom: '3px solid rgba(0, 0, 0, 0.5)'
}));

// Checkbox cell
const CheckboxCell = styled(StyledTableCell)(({ theme }) => ({
  padding: '0 4px',
  width: '40px'
}));

// Add hover effect and double-click functionality to rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    cursor: 'pointer'
  }
}));

// Memoized table row component to prevent unnecessary re-renders
const MemoizedTableRow = memo(({ 
  entry, 
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
      sx={isSelected ? { backgroundColor: 'rgba(0, 0, 0, 0.05)' } : {}}
    >
      {/* Selection checkbox */}
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
      
      {/* Date */}
      <StyledTableCell>
        {new Date(entry.flight_date).toLocaleDateString()}
      </StyledTableCell>
      
      {/* Aircraft */}
      <StyledTableCell>{entry.aircraft_name || entry.aircraft_model}</StyledTableCell>
      <StyledTableCell>{entry.aircraft_reg}</StyledTableCell>
      
      {/* Crew */}
      <WrappingCell>{entry.pilot_in_command || entry.pic_name || '-'}</WrappingCell>
      <WrappingCell>{entry.other_crew || (entry.is_self_pic ? 'SELF' : '-')}</WrappingCell>
      
      {/* Route */}
      <WrappingCell width="125px">
        {entry.formatted_route ? entry.formatted_route : '-'}
      </WrappingCell>
      
      {/* Details with thick right border */}
      <WrappingCellThickRightBorder width="125px">{entry.details || '-'}</WrappingCellThickRightBorder>
      
      {/* Single-Engine */}
      <DayCell>{entry.single_engine_icus_day}</DayCell>
      <NightCell>{entry.single_engine_icus_night}</NightCell>
      <DayCell>{entry.single_engine_dual_day}</DayCell>
      <NightCell>{entry.single_engine_dual_night}</NightCell>
      <DayCell>{entry.single_engine_command_day}</DayCell>
      <NightThickRightBorderCell>{entry.single_engine_command_night}</NightThickRightBorderCell>
      
      {/* Multi-Engine */}
      <DayCell>{entry.multi_engine_icus_day}</DayCell>
      <NightCell>{entry.multi_engine_icus_night}</NightCell>
      <DayCell>{entry.multi_engine_dual_day}</DayCell>
      <NightCell>{entry.multi_engine_dual_night}</NightCell>
      <DayCell>{entry.multi_engine_command_day}</DayCell>
      <NightThickRightBorderCell>{entry.multi_engine_command_night}</NightThickRightBorderCell>
      
      {/* Co-Pilot */}
      <DayCell>{entry.co_pilot_day}</DayCell>
      <NightThickRightBorderCell>{entry.co_pilot_night}</NightThickRightBorderCell>
      
      {/* Instrument */}
      <DayCell>{entry.instrument_flight}</DayCell>
      <SimCell>{entry.instrument_sim}</SimCell>
    </StyledTableRow>
  );
});

// Set display name for debugging
MemoizedTableRow.displayName = 'MemoizedClassicTableRow';

const LogbookTableClassic = ({ 
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

  // Memoize the table header to prevent re-rendering when only data changes
  const tableHeader = useMemo(() => (
    <TableHead>
      <TableRow>
        {/* Selection column */}
        {selectionMode && (
          <HeaderCell rowSpan={3} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)', width: '40px', padding: '0 4px' }}>
            <Checkbox
              indeterminate={Object.keys(selectedEntries).length > 0 && !isAllSelected}
              checked={isAllSelected}
              onChange={handleSelectAllClick}
              inputProps={{ 'aria-label': 'select all entries' }}
              size="small"
            />
          </HeaderCell>
        )}
        
        {/* Date column */}
        <HeaderCell rowSpan={3} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>DATE</HeaderCell>
        
        {/* Aircraft columns */}
        <GroupHeaderCell colSpan={2}>AIRCRAFT</GroupHeaderCell>
        
        {/* Crew columns */}
        <GroupHeaderCell colSpan={2}>CREW</GroupHeaderCell>
        
        {/* Details group header */}
        <ThickRightBorderGroupHeaderCell colSpan={2}>DETAILS</ThickRightBorderGroupHeaderCell>
        
        {/* Single-Engine columns */}
        <ThickRightBorderGroupHeaderCell colSpan={6}>SINGLE-ENGINE</ThickRightBorderGroupHeaderCell>
        
        {/* Multi-Engine columns with thick right border */}
        <ThickRightBorderGroupHeaderCell colSpan={6}>MULTI-ENGINE</ThickRightBorderGroupHeaderCell>
        
        {/* Co-Pilot columns with thick right border */}
        <ThickRightBorderGroupHeaderCell colSpan={2}>CO-PILOT</ThickRightBorderGroupHeaderCell>
        
        {/* Instrument columns */}
        <GroupHeaderCell colSpan={2}>INSTRUMENT</GroupHeaderCell>
      </TableRow>
      
      <TableRow>
        {/* Aircraft subcolumns */}
        <HeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>TYPE</HeaderCell>
        <HeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)', width: '80px' }}>REGISTRATION</HeaderCell>
        
        <HeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>PILOT IN <br /> COMMAND</HeaderCell>
        <HeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>OTHER PILOT OR <br />CREW</HeaderCell>
        
        {/* Route and details */}
        <HeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>ROUTE</HeaderCell>
        <ThickRightBorderHeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>DETAILS</ThickRightBorderHeaderCell>
        
        {/* Single-Engine subcolumns */}
        <HeaderCell colSpan={2}>I.C.U.S.</HeaderCell>
        <HeaderCell colSpan={2}>DUAL</HeaderCell>
        <ThickRightBorderHeaderCell colSpan={2}>COMMAND</ThickRightBorderHeaderCell>
        
        {/* Multi-Engine subcolumns */}
        <HeaderCell colSpan={2}>I.C.U.S.</HeaderCell>
        <HeaderCell colSpan={2}>DUAL</HeaderCell>
        <ThickRightBorderHeaderCell colSpan={2}>COMMAND</ThickRightBorderHeaderCell>
        
        {/* Co-Pilot subcolumns */}
        <VerticalHeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>
          <Box>DAY</Box>
        </VerticalHeaderCell>
        <VerticalNightThickRightBorderHeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>
          <Box>NIGHT</Box>
        </VerticalNightThickRightBorderHeaderCell>
        
        {/* Instrument subcolumns */}
        <VerticalHeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>
          <Box>IN FLIGHT</Box>
        </VerticalHeaderCell>
        <VerticalSimHeaderCell rowSpan={2} sx={{ borderBottom: '3px solid rgba(0, 0, 0, 0.5)' }}>
          <Box>IN SIM</Box>
        </VerticalSimHeaderCell>
      </TableRow>
      
      <TableRow sx={{ '& th': { borderBottom: '3px solid rgba(0, 0, 0, 0.5)' } }}>
        {/* Single-Engine Day/Night subcolumns */}
        <BottomRowHeaderCell>
          <Box>DAY</Box>
        </BottomRowHeaderCell>
        <BottomRowNightHeaderCell>
          <Box>NIGHT</Box>
        </BottomRowNightHeaderCell>
        <BottomRowHeaderCell>
          <Box>DAY</Box>
        </BottomRowHeaderCell>
        <BottomRowNightHeaderCell>
          <Box>NIGHT</Box>
        </BottomRowNightHeaderCell>
        <BottomRowHeaderCell>
          <Box>DAY</Box>
        </BottomRowHeaderCell>
        <BottomRowNightThickRightBorderHeaderCell>
          <Box>NIGHT</Box>
        </BottomRowNightThickRightBorderHeaderCell>
        
        {/* Multi-Engine Day/Night subcolumns */}
        <BottomRowHeaderCell>
          <Box>DAY</Box>
        </BottomRowHeaderCell>
        <BottomRowNightHeaderCell>
          <Box>NIGHT</Box>
        </BottomRowNightHeaderCell>
        <BottomRowHeaderCell>
          <Box>DAY</Box>
        </BottomRowHeaderCell>
        <BottomRowNightHeaderCell>
          <Box>NIGHT</Box>
        </BottomRowNightHeaderCell>
        <BottomRowHeaderCell>
          <Box>DAY</Box>
        </BottomRowHeaderCell>
        <BottomRowNightThickRightBorderHeaderCell>
          <Box>NIGHT</Box>
        </BottomRowNightThickRightBorderHeaderCell>
      </TableRow>
    </TableHead>
  ), [handleSelectAllClick, isAllSelected, selectedEntries, selectionMode]);

  return (
    <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
      <Table size="small" aria-label="classic flight logbook">
        {tableHeader}
        <TableBody>
          {entries.map((entry) => (
            <MemoizedTableRow
              key={entry.id}
              entry={entry}
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
export default memo(LogbookTableClassic);

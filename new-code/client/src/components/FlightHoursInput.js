import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  InputBase,
} from '@mui/material';

const FlightHoursInput = ({ formData, handleChange }) => {
  // State to track the displayed engine type
  const [displayEngineType, setDisplayEngineType] = useState('SELECT AN AIRCRAFT FOR ENGINE TYPE');

  // Update the engine type display whenever aircraft_reg or engine_type changes
  useEffect(() => {
    if (!formData.aircraft_reg) {
      setDisplayEngineType('SELECT AN AIRCRAFT FOR ENGINE TYPE');
    } else if (formData.engine_type) {
      // Convert to uppercase for display
      setDisplayEngineType(formData.engine_type.toUpperCase());
    } else {
      setDisplayEngineType('SINGLE-ENGINE');
    }
  }, [formData.aircraft_reg, formData.engine_type]);

  // Custom handler for direct input fields
  const handleDirectInputChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal points
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      handleChange({
        target: {
          name,
          value
        }
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 1,
          p: 2,
          mb: 2
        }}>
          <Typography variant="subtitle1" gutterBottom>
            Flight Hours
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ fontWeight: 'bold', borderBottom: 2 }}>
                    {displayEngineType}
                  </TableCell>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', borderBottom: 2 }}>
                    CO-PILOT
                  </TableCell>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', borderBottom: 2 }}>
                    INSTRUMENT
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    I.C.U.S.
                  </TableCell>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    DUAL
                  </TableCell>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    COMMAND
                  </TableCell>
                  <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    &nbsp;
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    &nbsp;
                  </TableCell>
                </TableRow>
                <TableRow>
                  {/* ICUS */}
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    DAY
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    NIGHT
                  </TableCell>
                  
                  {/* DUAL */}
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    DAY
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    NIGHT
                  </TableCell>
                  
                  {/* COMMAND */}
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    DAY
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    NIGHT
                  </TableCell>
                  
                  {/* CO-PILOT */}
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    DAY
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    NIGHT
                  </TableCell>
                  
                  {/* INSTRUMENT */}
                  <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: 1, borderRightColor: 'divider' }}>
                    IN FLIGHT
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    IN SIM
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* ICUS */}
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider', height: '50px' }}>
                    <InputBase
                      name="icus_day"
                      value={formData.icus_day}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="icus_night"
                      value={formData.icus_night}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  
                  {/* DUAL */}
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="dual_day"
                      value={formData.dual_day}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="dual_night"
                      value={formData.dual_night}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  
                  {/* COMMAND */}
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="command_day"
                      value={formData.command_day}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="command_night"
                      value={formData.command_night}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  
                  {/* CO-PILOT */}
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="co_pilot_day"
                      value={formData.co_pilot_day}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="co_pilot_night"
                      value={formData.co_pilot_night}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  
                  {/* INSTRUMENT */}
                  <TableCell align="center" sx={{ p: 1, borderRight: 1, borderRightColor: 'divider' }}>
                    <InputBase
                      name="instrument_flight"
                      value={formData.instrument_flight}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ p: 1 }}>
                    <InputBase
                      name="instrument_sim"
                      value={formData.instrument_sim}
                      onChange={handleDirectInputChange}
                      inputProps={{ 
                        style: { textAlign: 'center' },
                        min: "0",
                        step: "0.1"
                      }}
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        '& input': {
                          textAlign: 'center',
                          fontSize: '0.875rem',
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FlightHoursInput; 
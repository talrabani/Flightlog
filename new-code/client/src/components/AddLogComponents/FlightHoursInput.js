import React, { useEffect, useState } from 'react';
import {
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FormBox from './FormBox';

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
        <FormBox title="Flight Hours" icon={<AccessTimeIcon color="primary" />}>
          <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Table size="small" sx={{ 
              tableLayout: 'fixed', 
              border: '2px solid black',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              backgroundColor: '#f8f9fa'
            }}>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ 
                    fontWeight: 'bold', 
                    borderBottom: '1px solid black',
                    borderRight: '2px solid black',
                    borderLeft: '2px solid black',
                    padding: '8px 4px'
                  }}>
                    {displayEngineType}
                  </TableCell>
                  <TableCell rowSpan={2} align="center" sx={{ 
                    fontWeight: 'bold', 
                    borderBottom: '1px solid black',
                    borderRight: '2px solid black',
                    borderLeft: '2px solid black',
                    padding: '8px 4px',
                    verticalAlign: 'middle'
                  }}>
                    CO-PILOT
                  </TableCell>
                  <TableCell rowSpan={2} align="center" sx={{ 
                    fontWeight: 'bold', 
                    borderBottom: '1px solid black',
                    borderLeft: '2px solid black',
                    padding: '8px 4px',
                    verticalAlign: 'middle'
                  }}>
                    INSTRUMENT
                  </TableCell>
                </TableRow>
                <TableRow sx={{ height: '20px' }}> {/* 2nd row*/}
                  <TableCell align="center" sx={{ 
                    fontWeight: 'bold', 
                    borderRight: '1px solid black',
                    padding: '4px'
                  }}>
                    I.C.U.S.
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 'bold', 
                    borderRight: '1px solid black',
                    padding: '4px' // Reduced padding
                  }}>
                    DUAL
                  </TableCell>
                  <TableCell align="center" sx={{ 
                    fontWeight: 'bold', 
                    borderRight: '2px solid black',
                    padding: '4px' // Reduced padding
                  }}>
                    COMMAND
                  </TableCell>
                </TableRow>
                <TableRow>
                  {/* ICUS */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '1px solid black',
                    borderTop: '2px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold'
                      }}>
                        DAY
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold',
                        backgroundColor: '#a8d1f0'
                      }}>
                        NIGHT
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* DUAL */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '1px solid black',
                    borderTop: '2px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold'
                      }}>
                        DAY
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold',
                        backgroundColor: '#a8d1f0'
                      }}>
                        NIGHT
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* COMMAND */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '2px solid black',
                    borderTop: '2px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold'
                      }}>
                        DAY
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold',
                        backgroundColor: '#a8d1f0'
                      }}>
                        NIGHT
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* CO-PILOT */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '2px solid black',
                    borderLeft: '2px solid black',
                    borderTop: '2px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold'
                      }}>
                        DAY
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold',
                        backgroundColor: '#a8d1f0'
                      }}>
                        NIGHT
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* INSTRUMENT */}
                  <TableCell sx={{ 
                    padding: 0,
                    borderLeft: '2px solid black',
                    borderTop: '2px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold',
                        backgroundColor: 'white'
                      }}>
                        IN FLIGHT
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: '2px solid black',
                        padding: '8px 4px',
                        fontWeight: 'bold',
                        backgroundColor: '#f0c8a8'
                      }}>
                        IN SIM
                      </TableCell>
                    </TableRow>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {/* ICUS */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '1px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: 'none',
                        padding: '8px 4px'
                      }}>
                        <InputBase
                          name="icus_day"
                          value={formData.icus_day}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: 'none',
                        padding: '8px 4px',
                        backgroundColor: '#a8d1f0'
                      }}>
                        <InputBase
                          name="icus_night"
                          value={formData.icus_night}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* DUAL */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '1px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: 'none',
                        padding: '8px 4px'
                      }}>
                        <InputBase
                          name="dual_day"
                          value={formData.dual_day}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: 'none',
                        padding: '8px 4px',
                        backgroundColor: '#a8d1f0'
                      }}>
                        <InputBase
                          name="dual_night"
                          value={formData.dual_night}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* COMMAND */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '1px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: 'none',
                        padding: '8px 4px'
                      }}>
                        <InputBase
                          name="command_day"
                          value={formData.command_day}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: 'none',
                        padding: '8px 4px',
                        backgroundColor: '#a8d1f0'
                      }}>
                        <InputBase
                          name="command_night"
                          value={formData.command_night}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* CO-PILOT */}
                  <TableCell sx={{ 
                    padding: 0, 
                    borderRight: '1px solid black'
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: 'none',
                        padding: '8px 4px'
                      }}>
                        <InputBase
                          name="co_pilot_day"
                          value={formData.co_pilot_day}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: 'none',
                        padding: '8px 4px',
                        backgroundColor: '#a8d1f0'
                      }}>
                        <InputBase
                          name="co_pilot_night"
                          value={formData.co_pilot_night}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableCell>
                  
                  {/* INSTRUMENT */}
                  <TableCell sx={{ 
                    padding: 0
                  }}>
                    <TableRow sx={{ display: 'flex', height: '100%' }}>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderRight: '1px solid black',
                        borderBottom: 'none',
                        padding: '8px 4px',
                        backgroundColor: 'white'
                      }}>
                        <InputBase
                          name="instrument_flight"
                          value={formData.instrument_flight}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        flex: 1, 
                        borderBottom: 'none',
                        padding: '8px 4px',
                        backgroundColor: '#f0c8a8'
                      }}>
                        <InputBase
                          name="instrument_sim"
                          value={formData.instrument_sim}
                          onChange={handleDirectInputChange}
                          inputProps={{ 
                            style: { textAlign: 'center', fontWeight: 'bold' }, // Bold text
                            min: "0",
                            step: "0.1"
                          }}
                          sx={{ 
                            width: '100%',
                            '& input': {
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 'bold' // Bold text
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </FormBox>
      </Grid>
    </Grid>
  );
};

export default FlightHoursInput; 
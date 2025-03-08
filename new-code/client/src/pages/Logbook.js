import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box
} from '@mui/material';
import config from '../config';

function Logbook() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/logbook/1`);
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching logbook entries:', error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Flight Logbook
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="flight logbook">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Aircraft Type</TableCell>
                <TableCell>Registration</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Total Time</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Night</TableCell>
                <TableCell>Instrument</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => {
                const totalDay = (entry.icus_day || 0) + 
                               (entry.dual_day || 0) + 
                               (entry.command_day || 0) + 
                               (entry.co_pilot_day || 0);
                
                const totalNight = (entry.icus_night || 0) + 
                                 (entry.dual_night || 0) + 
                                 (entry.command_night || 0) + 
                                 (entry.co_pilot_night || 0);
                
                const totalInstrument = (entry.instrument_flight || 0) + 
                                      (entry.instrument_sim || 0);

                const totalTime = totalDay + totalNight + totalInstrument;

                return (
                  <TableRow key={entry.id}>
                    <TableCell>{new Date(entry.flight_date).toLocaleDateString()}</TableCell>
                    <TableCell>{entry.aircraft_type}</TableCell>
                    <TableCell>{entry.aircraft_reg}</TableCell>
                    <TableCell>{entry.route}</TableCell>
                    <TableCell>{totalTime.toFixed(1)}</TableCell>
                    <TableCell>{totalDay.toFixed(1)}</TableCell>
                    <TableCell>{totalNight.toFixed(1)}</TableCell>
                    <TableCell>{totalInstrument.toFixed(1)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default Logbook; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Box,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';

function Logbook() {
  const navigate = useNavigate();
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

  const calculateTotal = (values) => {
    return values.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
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
                const totalDay = calculateTotal([
                  entry.icus_day,
                  entry.dual_day,
                  entry.command_day,
                  entry.co_pilot_day
                ]);
                
                const totalNight = calculateTotal([
                  entry.icus_night,
                  entry.dual_night,
                  entry.command_night,
                  entry.co_pilot_night
                ]);
                
                const totalInstrument = calculateTotal([
                  entry.instrument_flight,
                  entry.instrument_sim
                ]);

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
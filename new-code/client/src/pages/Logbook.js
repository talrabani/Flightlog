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

  const columns = [
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
        return `${params.row.aircraft_model} (${params.row.aircraft_reg})`;
      }
    },
    {
      field: 'route',
      headerName: 'Route',
      width: 150,
      valueGetter: (params) => {
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
        const totalDay = calculateTotal([
          params.row.icus_day,
          params.row.dual_day,
          params.row.command_day,
          params.row.co_pilot_day
        ]);
        
        const totalNight = calculateTotal([
          params.row.icus_night,
          params.row.dual_night,
          params.row.command_night,
          params.row.co_pilot_night
        ]);
        
        const totalInstrument = calculateTotal([
          params.row.instrument_flight,
          params.row.instrument_sim
        ]);

        const totalTime = totalDay + totalNight + totalInstrument;
        return totalTime.toFixed(1);
      }
    },
    {
      field: 'day',
      headerName: 'Day',
      width: 100,
      valueGetter: (params) => {
        const totalDay = calculateTotal([
          params.row.icus_day,
          params.row.dual_day,
          params.row.command_day,
          params.row.co_pilot_day
        ]);
        return totalDay.toFixed(1);
      }
    },
    {
      field: 'night',
      headerName: 'Night',
      width: 100,
      valueGetter: (params) => {
        const totalNight = calculateTotal([
          params.row.icus_night,
          params.row.dual_night,
          params.row.command_night,
          params.row.co_pilot_night
        ]);
        return totalNight.toFixed(1);
      }
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      width: 100,
      valueGetter: (params) => {
        const totalInstrument = calculateTotal([
          params.row.instrument_flight,
          params.row.instrument_sim
        ]);
        return totalInstrument.toFixed(1);
      }
    },
  ];

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
                {columns.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
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
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {column.valueGetter ? column.valueGetter({ row: entry }) : entry[column.field]}
                      </TableCell>
                    ))}
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
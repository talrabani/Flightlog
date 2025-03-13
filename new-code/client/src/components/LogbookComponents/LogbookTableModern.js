import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const LogbookTableModern = ({ entries }) => {
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
  ];

  return (
    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Table sx={{ width: '100%' }} aria-label="flight logbook">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field}>{column.headerName}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.valueGetter 
                    ? column.valueGetter({ row: entry }) 
                    : column.valueFormatter 
                      ? column.valueFormatter({ value: entry[column.field] }) 
                      : entry[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LogbookTableModern;

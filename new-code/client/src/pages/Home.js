import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert
} from '@mui/material';
import config from '../config';

function Home() {
  const [stats, setStats] = useState({
    hours_this_month: 0,
    hours_this_year: 0,
    lifetime_hours: 0,
    popular_airport: 'N/A',
    popular_plane: 'N/A',
    longest_flight: 0,
    average_flight_duration: 0,
    night_flight_hours: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching from:', `${config.apiUrl}/api/statistics/1`);
        const response = await axios.get(`${config.apiUrl}/api/statistics/1`);
        console.log('Response data:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(error.message);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, unit = '' }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">
          {typeof value === 'number' ? value.toFixed(1) : value}
          {unit && <span style={{ fontSize: '0.8em' }}> {unit}</span>}
        </Typography>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Flight Statistics
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading statistics: {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          <StatCard title="Hours This Month" value={stats.hours_this_month} unit="hrs" />
          <StatCard title="Hours This Year" value={stats.hours_this_year} unit="hrs" />
          <StatCard title="Lifetime Hours" value={stats.lifetime_hours} unit="hrs" />
          <StatCard 
            title="Most Common Airport" 
            value={
              stats.popular_airport && stats.popular_airport !== 'N/A' ? 
                (() => {
                    const airport = JSON.parse(stats.popular_airport);
                    return airport.icao ? 
                        `${airport.icao} - ${airport.name}` :
                        airport.name;
                })() :
                'N/A'
            } 
          />
          <StatCard title="Most Common Aircraft" value={stats.popular_plane} />
          <StatCard title="Longest Flight" value={stats.longest_flight} unit="hrs" />
          <StatCard title="Average Flight Duration" value={stats.average_flight_duration} unit="hrs" />
          <StatCard title="Night Flight Hours" value={stats.night_flight_hours} unit="hrs" />
        </Grid>
      </Box>
    </Container>
  );
}

export default Home; 
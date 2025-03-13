import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Box, Button } from '@mui/material';

function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#333333', marginBottom: '2rem' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '2rem' }}>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/logbook" color="inherit">
            Logbook
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 
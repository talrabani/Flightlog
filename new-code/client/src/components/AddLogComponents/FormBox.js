import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

const FormBox = ({ title, icon, children }) => {
  return (
    <Box sx={{ 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 1,
      p: 2,
      mb: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#f8f9fa'
    }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <h3>{title}</h3>
      {icon}  
      </Typography>
      {children}
    </Box>
  );
};

export default FormBox; 
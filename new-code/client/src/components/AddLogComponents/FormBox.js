import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

const FormBox = ({ title, icon, children, action }) => {
  return (
    <Box sx={{ 
      border: 1, 
      borderColor: 'divider', 
      borderRadius: 1,
      pt: 1,
      pb: 2,
      px: 2,
      mb: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: '#f8f9fa',
      position: 'relative'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 0.5
      }}>
        <Typography variant="subtitle1" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1
        }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {icon}  
        </Typography>
        {action && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            {action}
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default FormBox; 
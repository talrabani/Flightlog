import React from 'react';
import { Grid, Button, Stack } from '@mui/material';

function ActionButtons({ handleCancel }) {
  return (
    <Grid item xs={12}>
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          onClick={handleCancel}
          sx={{ flex: 1, color: 'gray', borderColor: 'gray' }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ flex: 1 }}
        >
          Log Flight
        </Button>
      </Stack>
    </Grid>
  );
}

export default ActionButtons; 
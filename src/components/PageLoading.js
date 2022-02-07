import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function PageLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '35vh', flex: 1 }}>
      <CircularProgress size={50} color="primary" sx={{ opacity: 0.1 }} />
    </Box>
  );
}

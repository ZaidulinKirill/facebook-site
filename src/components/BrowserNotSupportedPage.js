import { Box } from '@mui/material';
import React from 'react';

export default function BrowserNotSupportedPage() {
  return (
    <Box sx={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '30px' }}>
      Sorry, this browser is too old and not supported.
      {' '}
      <br />
      Please, use another browser
    </Box>
  );
}

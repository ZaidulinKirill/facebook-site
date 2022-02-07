import { Box } from '@mui/material';
import React, { useState } from 'react';

export const SiteUnderConstruction = ({ message }) => (
  <Box sx={{ height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: { xs: '2rem', md: '4rem' } }}
  >
    {message}
  </Box>
);

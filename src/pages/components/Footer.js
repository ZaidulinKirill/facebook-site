import { Box, styled } from '@mui/material';
import React from 'react';

const StyledImage = styled('img')({});

export default function Footer() {
  return (
    <Box
      id={1}
      sx={{
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgb(13, 30, 52)',
        overflow: 'hidden',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box sx={{ height: '7px', background: 'rgb(250, 213, 73)', width: '100%' }} />
      <Box sx={{ height: '7px', background: 'rgb(225, 110, 56)', width: '100%', mt: '4px' }} />
      <Box sx={{ height: '7px', background: 'rgb(236, 177, 189)', width: '100%', mt: '4px' }} />
      <Box sx={{ flexGrow: 1, width: '100%', pl: '5%', display: 'flex', alignItems: 'center' }}>
        <StyledImage src="/tomra_logo_white.png" alt="bg" sx={{ width: { xs: '150px', sm: '200px' } }} />
      </Box>
    </Box>
  );
}

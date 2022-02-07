import { Box } from '@mui/material';
import React from 'react';
import ReactPlayer from 'react-player/lazy';

export const Video = ({ controls = true, ratio = '56.25%', sx, ...props }) => {
  if (!props.url) {
    return null;
  }

  return (
    <Box sx={{
      width: '100%',
      position: 'relative',
      paddingBottom: ratio, // Player ratio: 100 / (1280 / 720)
      ...sx,
    }}
    >
      <ReactPlayer style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} width="100%" height="100%" controls={controls} {...props} />
    </Box>
  );
};

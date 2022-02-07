import { Box } from '@mui/material';
import React from 'react';

export const FormBlockOfText = ({ text, fontFamily, fontWeight, fontSize, marginTop, fontColor }) => (
  <Box sx={{
    whiteSpace: 'pre-line',
    color: fontColor || 'var(--text-primary)',
    mt: marginTop,
    ...fontFamily && {
      fontFamily,
    },
    ...fontWeight && {
      fontWeight,
    },
    ...fontSize && {
      fontSize: `${fontSize}rem`,
    },
  }}
  >
    {text}
  </Box>
);

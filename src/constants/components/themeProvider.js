import React from 'react';
import { Box, useTheme } from '@mui/material';
import { ThemeProvider as ThemeProviderBase, createTheme } from '@mui/material/styles';

export const ThemeProvider = ({ mode = 'light', primaryColor, secondaryColor, themeProps, children, ...props }) => {
  const currentTheme = useTheme();

  const theme = createTheme({
    ...currentTheme,
    palette: {
      mode,
      primary: !primaryColor ? currentTheme.palette.primary : {
        main: primaryColor,
      },
      secondary: !secondaryColor ? currentTheme.palette.secondary : {
        main: secondaryColor,
      },
      error: {
        main: '#ff1744',
      },
    },
    ...themeProps,
  });

  return (
    <Box
      sx={{
        '--primary-color': theme.palette.primary.main,
        '--primary-text-color': theme.palette.primary.contrastText,
        '--primary-color-dark': theme.palette.primary.dark,
        '--primary-color-light': theme.palette.primary.light,
        '--secondary-color': theme.palette.secondary.main,
        '--secondary-text-color': theme.palette.secondary.contrastText,
        '--error-color': theme.palette.error.main,
        '--error-text-color': theme.palette.error.contrastText,
        '--text-primary': theme.palette.text?.primary,
        '--text-secondary': theme.palette.text?.secondary,
      }}
      {...props}
    >
      <ThemeProviderBase theme={theme}>
        {children}
      </ThemeProviderBase>
    </Box>
  );
};

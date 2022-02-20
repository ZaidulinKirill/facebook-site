import React from 'react';
import {
  Box, Button as ButtonBase, CircularProgress as CircularProgressBase, IconButton,
} from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CircularProgress = ({ useMainColor, ...props }) => (
  <CircularProgressBase
    size={24}
    {...props}
  />
);

const Button = ({ fullWidth = true, isSaving, label, type = 'submit', ...props }) => (
  <ButtonBase {...props} fullWidth={fullWidth} color="primary" type={type}>
    {!isSaving ? label : (
      <CircularProgress useMainColor={props.variant === 'text' || props.variant === 'outlined'} />
    )}
  </ButtonBase>
);

export const BackButton = ({ color, label, alignment, marginTop, isVisible = true, sx, ...props }) => {
  const currentTheme = useTheme();
  const navigate = useNavigate();

  const newTheme = createTheme({
    ...currentTheme,
    ...color && {
      palette: {
        ...currentTheme.palette,
        primary: {
          main: color,
        },
      },
    },
  });

  if (!isVisible) {
    return null;
  }

  const isIcon = !label?.length;

  return (
    <ThemeProvider theme={newTheme}>
      <Box sx={[{ display: 'flex', alignItems: 'center', justifyContent: alignment, pt: marginTop, mr: { xs: 1, sm: 5 } }, sx]}>
        <Button
          label={label}
          sx={{ display: { xs: 'none', ...!isIcon && { sm: 'flex' } } }}
          type="button"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          {...props}
        />
        <IconButton
          sx={{ display: { xs: 'flex', ...!isIcon && { sm: 'none' } }, width: 'auto' }}
          type="button"
          onClick={() => navigate(-1)}
          {...props}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </ThemeProvider>
  );
};

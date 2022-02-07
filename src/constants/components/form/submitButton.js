import React, { useContext } from 'react';
import { Box, Button as ButtonBase, CircularProgress as CircularProgressBase } from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { FormContext } from '../../../contexts';

const CircularProgress = ({ useMainColor, ...props }) => (
  <CircularProgressBase
    size={24}
    {...props}
  />
);

const Button = ({ fullWidth = true, isSaving, label, ...props }) => (
  <ButtonBase {...props} fullWidth={fullWidth} color="primary" type="submit">
    {!isSaving ? label : (
      <CircularProgress useMainColor={props.variant === 'text' || props.variant === 'outlined'} />
    )}
  </ButtonBase>
);

export const SubmitButton = ({ color, label, alignment, marginTop, sx, ...props }) => {
  const currentTheme = useTheme();
  const { isSaving } = useContext(FormContext);

  const newTheme = createTheme({
    ...currentTheme,
    ...color && { palette: {
      ...currentTheme.palette,
      primary: {
        main: color,
      },
    } },
  });

  return (
    <ThemeProvider theme={newTheme}>
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: alignment, pt: marginTop }}>
        <Button isSaving={isSaving} disabled={isSaving} label={label} sx={{ minWidth: '150px', ...sx }} {...props} />
      </Box>
    </ThemeProvider>
  );
};

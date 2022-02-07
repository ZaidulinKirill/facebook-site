import { useMediaQuery, useTheme } from '@mui/material';

export const useCurrentBreakpoint = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.only('xs'));
  const sm = useMediaQuery(theme.breakpoints.only('sm'));

  if (xs) {
    return 'xs';
  }

  if (sm) {
    return 'sm';
  }

  return 'md';
};

import { Button, Snackbar } from '@mui/material';
import React, { useEffect } from 'react';

export const CookieConsent = ({ message, acceptButtonText }) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const isShown = localStorage.getItem('cookie-consent');
    if (!isShown) {
      setOpen(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('cookie-consent', 'true');
    setOpen(false);
  };

  const action = (
    <Button color="secondary" size="small" onClick={acceptConsent}>
      {acceptButtonText}
    </Button>
  );

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ maxWidth: '700px' }}
      action={action}
      message={message}
    />
  );
};

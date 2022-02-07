import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function Drawer({ sx, children, activatorStyle, width, ...props }) {
  const [isOpened, setIsOpened] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setIsOpened(false);

    return () => {
      setIsOpened(false);
    };
  }, [location]);

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' }, ...sx }}>
      <IconButton sx={activatorStyle} color="inherit" onClick={() => setIsOpened(true)}>
        <MenuIcon />
      </IconButton>

      <SwipeableDrawer
        {...props}
        anchor={props.anchor || 'left'}
        open={isOpened}
        onClose={() => setIsOpened(false)}
        PaperProps={{
          sx: { width },
        }}
      >
        {children}
      </SwipeableDrawer>
    </Box>
  );
}

/* eslint-disable react/no-danger */
import React, { useContext, useState } from 'react';
import {
  Avatar, Box, Button, Container,
  Divider, List, ListItemAvatar, ListItemButton,
  ListItemText, Menu, MenuItem, Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary, Typography, styled,
} from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PageContext, SiteContext, UserContext } from '../../../contexts';
import LanguageSelector from '../languageSelector';
import getLocalizedPath from '../../../utils/getLocalizedPath';

export default function FacebookNavbar({ title }) {
  const page = useContext(PageContext);
  const challengesStore = page.modules.find((x) => x.moduleType === 'facebook-challenges');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { site: { language } } = useContext(SiteContext);
  const [user] = useContext(UserContext);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout');
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 7, px: 10 }}>
      <Box sx={{ width: '250px', display: { xs: 'none', lg: 'block' } }} />
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: '500' }}>{title}</Typography>
      </Box>
      <Box sx={{ width: { xs: '100%' }, mt: { xs: 2, md: 0 }, justifyContent: { xs: 'center', md: 'center' }, display: 'flex', alignItems: 'center' }}>
        <LanguageSelector sx={{ mr: 2 }} />

        <Button sx={{ display: 'flex', lineHeight: 1.2 }} onClick={openMenu}>
          <Avatar src="https://mui.com/static/images/avatar/1.jpg" sx={{ mr: 1 }} />
          {`${user.lastName} ${user.name}`.trim()}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          disableScrollLock
          onClose={handleClose}
        >
          <MenuItem onClick={() => navigate(getLocalizedPath(language, '/account'))}>
            Account
          </MenuItem>
          <MenuItem onClick={logout}>
            Log out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

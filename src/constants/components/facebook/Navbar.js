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
import { Link, useNavigate } from 'react-router-dom';
import { PageContext, SiteContext, UserContext } from '../../../contexts';
import LanguageSelector from '../languageSelector';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import { ThemeProvider } from '../themeProvider';
import UserAvatar from '../../../components/UserAvatar';

const StyledImage = styled('img')({});

export default function FacebookNavbar({ title }) {
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
    <Box sx={{ px: 3, py: 1, backgroundColor: 'rgb(13, 30, 52)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <StyledImage src="/tomra_logo_white.png" sx={{ width: { xs: '100px', sm: '130px' }, justifySelf: 'flex-start', mr: 1 }} />
          <StyledImage src="/logo.png" sx={{ display: { xs: 'none', sm: 'inline' }, width: '50px', justifySelf: 'flex-start' }} />
        </Link>
        <ThemeProvider primaryColor="#ffffff" sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
          <LanguageSelector sx={{ ml: 'auto', mr: { xs: 0, sm: 2 } }} />
          <Button
            id="account-button"
            sx={{ display: 'flex', lineHeight: 1.2 }}
            onClick={openMenu}
          >
            <Box sx={{
              maxWidth: { xs: '100px', sm: '200px' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              '-webkit-line-clamp': '2',
              '-webkit-box-orient': 'vertical',
            }}
            >
              {`${user.name} ${user.lastName}`.trim()}
            </Box>
            <UserAvatar user={user} sx={{ ml: { xs: 1, sm: 1.5 } }} />
          </Button>
        </ThemeProvider>
        <Menu
          PaperProps={{
            style: {
              width: '140px',
            },
          }}
          anchorEl={anchorEl}
          open={open}
          disableScrollLock
          aria-labelledby="account-button"
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

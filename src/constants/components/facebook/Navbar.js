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
import PersonIcon from '@mui/icons-material/Person';
import { PageContext, SiteContext, UserContext } from '../../../contexts';
import LanguageSelector from '../languageSelector';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import { ThemeProvider } from '../themeProvider';
import UserAvatar from '../../../components/UserAvatar';

const StyledImage = styled('img')({});
const StyledLink = styled(Link)({});

export default function FacebookNavbar({ title, large }) {
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
    <Box sx={{ px: 3, py: 3, backgroundColor: 'rgb(13, 30, 52)' }}>
      <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link to="/" style={{ alignItems: 'center' }}>
          {/* <StyledImage src="/tomra_logo_white.png" sx={{ width: { xs: '100px', sm: '130px' }, justifySelf: 'flex-start', mr: 1 }} /> */}
          <StyledImage src="/logo.png" sx={{ display: { xs: 'none', sm: 'flex' }, width: { xs: '50px', sm: '80px' }, height: 'auto', justifySelf: 'flex-start' }} width={400} height={301} />
        </Link>

        <ThemeProvider primaryColor="rgb(217, 0, 58)" sx={{ ml: { xs: 0, sm: 'auto' }, display: 'flex', alignItems: 'center' }}>
          <Button
            id="account-button"
            sx={{
              display: 'flex',
              mr: 3,
              lineHeight: 1.2,
              color: 'white',
              boxShadow: 'none',
              borderRadius: '50px',
              padding: '13px 20px',
              textTransform: 'capitalize',
              fontSize: '16px',
            }}
            onClick={openMenu}
            variant="contained"
          >
            <PersonIcon sx={{ mr: 1 }} />
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
            {/* <UserAvatar user={user} sx={{ ml: { xs: 1, sm: 1.5 } }} /> */}
          </Button>
        </ThemeProvider>
        <ThemeProvider primaryColor="#ffffff" sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSelector sx={{ mr: { xs: 0, sm: 2 }, fontSize: 18 }} />
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
      </Container>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '100%' }}>

      </Box> */}
    </Box>
  );
}

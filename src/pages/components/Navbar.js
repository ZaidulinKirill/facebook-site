/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Container,
  Menu, MenuItem, styled,
} from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowDownIcon from '@mui/icons-material/ArrowDownward';
import { PageContext, SiteContext, UserContext } from '../../contexts';
import LanguageSelector from '../../constants/components/languageSelector';
import { ThemeProvider } from '../../constants/components/themeProvider';
import getLocalizedPath from '../../utils/getLocalizedPath';

const StyledImage = styled('img')({});

export default function Navbar({ large }) {
  const page = useContext(PageContext);
  const translations = page.modules.find((x) => x.moduleType === 'translations');
  // {translations.moduleVariables.Challenges}

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { site: { language } } = useContext(SiteContext);
  const userState = useContext(UserContext);
  const [isButtonAnimationEnabled, setIsButtonAnimationEnabled] = useState(true);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    handleClose();

    await axios.post('/api/auth/logout');
    window.location.reload();
  };

  const handleClick = () => {
    document.querySelector('#main-content').scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => {
      setIsButtonAnimationEnabled(window.pageYOffset <= 50);
    };

    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{
        px: 3,
        py: 3,
        backgroundColor: 'rgb(13, 30, 52)',
        position: 'relative',
        ...large ? {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        } : {
          height: { xs: 'auto', sm: '375px' },
          overflow: 'hidden',
          position: 'relative',
        },
      }}
      >
        <Box sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
        >
          <StyledImage
            src="/tomra_banner_background_3.svg"
            alt="bg"
            sx={{
              height: large ? '500%' : '700%',
              transform: 'translate(28%,-19%)',
            }}
          />
        </Box>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          {userState[0] && (
            <Link to={getLocalizedPath(language, '/')} style={{ alignItems: 'center' }}>
              <StyledImage src="/tomra_logo_color.png" sx={{ display: { xs: 'none', sm: 'flex' }, width: { xs: '50px', sm: '150px' }, height: 'auto', justifySelf: 'flex-start' }} width={400} height={301} />
            </Link>
          )}
          {userState[0] && (
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
                  maxWidth: { xs: '400px', sm: '400px' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                }}
                >
                  {`${userState[0].name} ${userState[0].lastName}`.trim()}
                </Box>
              </Button>
            </ThemeProvider>
          ) }
          <ThemeProvider primaryColor="#ffffff" sx={{ display: 'flex', alignItems: 'center', ...!userState[0] && { ml: 'auto' } }}>
            <LanguageSelector sx={{ mr: { xs: 0, sm: 2 }, fontSize: 18 }} />
          </ThemeProvider>
          <Menu
            PaperProps={{ style: { width: '140px' } }}
            anchorEl={anchorEl}
            open={open}
            disableScrollLock
            aria-labelledby="account-button"
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); navigate(getLocalizedPath(language, '/account')); }}>
              {translations.moduleVariables.Account}
            </MenuItem>
            <MenuItem onClick={logout}>
              {translations.moduleVariables['Log out']}
            </MenuItem>
          </Menu>
        </Container>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          {large ? (
            <Box sx={{
              width: { xs: '70%', md: '50%', xl: '40%' },
              position: 'relative',
            }}
            >
              <Box sx={{
                display: { xs: 'none', md: 'block' },
                color: 'white',
                fontSize: { xs: '0px', sm: '32px', md: '60px', xl: '70px' },
                position: 'absolute',
                top: 0,
                left: 0,
                fontWeight: '500',
                textAlign: 'right',
                lineHeight: 1.1,
                transform: 'translateX(-100%)',
                whiteSpace: 'pre',
              }}
              >
                <div dangerouslySetInnerHTML={{ __html: translations.moduleVariables['Lets celebrate!'] }} />
              </Box>
              <StyledImage
                src="/logo_large.png"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                width={400}
                height={301}
              />
            </Box>
          ) : (
            <Box sx={{
              display: { xs: 'none', sm: 'block' },
              width: '300px',
              position: 'relative',
              ml: '50%',
              mt: '50px',
            }}
            >
              <Box sx={{
                display: { xs: 'none', md: 'block' },
                color: 'white',
                fontSize: { xs: '0px', sm: '1rem', md: '2rem' },
                position: 'absolute',
                top: 0,
                left: 0,
                fontWeight: '500',
                textAlign: 'right',
                lineHeight: 1.1,
                transform: 'translateX(-100%)',
                whiteSpace: 'pre',
              }}
              >
                <div dangerouslySetInnerHTML={{ __html: translations.moduleVariables['We challenge you to celebrate'] }} />
              </Box>
              <StyledImage
                src="/logo_large.png"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                width={400}
                height={301}
              />
            </Box>
          )}
        </Box>
      </Box>
      {large && (
        <Box sx={{ position: 'absolute', zIndex: 1, width: '100%', bottom: 10, display: 'flex', justifyContent: 'center' }}>
          <Box
            onClick={handleClick}
            sx={{
              width: '64px',
              height: '64px',
              background: 'white',
              transform: 'translateY(50%)',
              borderRadius: '100%',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <Box sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyboardArrowDownIcon sx={{ fontSize: '24px', mt: '0%' }} className={isButtonAnimationEnabled ? 'bounce' : ''} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

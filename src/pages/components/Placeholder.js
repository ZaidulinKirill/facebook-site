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

export default function Placeholder() {
  const { site } = useContext(SiteContext);
  const module = site.pages[0].modules.find((x) => x.systemType === 'siteUnderConstruction');

  const { title, message } = module.moduleVariables;
  console.log(title, message);
  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{
        px: 3,
        py: 3,
        backgroundColor: 'rgb(13, 30, 52)',
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
              height: '500%',
              transform: 'translate(28%,-19%)',
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, alignItems: 'center' }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              mr: { xs: 0, md: 8 },
              justifyContent: 'center',
              color: 'white',
              mb: { xs: 0, md: '7%' },
              mt: { xs: 3, md: 0 },
            }}
            >
              <Box sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                fontWeight: 'bold',
                textAlign: { xs: 'center', md: 'right' },
                lineHeight: 1.1,
              }}
              >
                <div dangerouslySetInnerHTML={{ __html: title }} />
              </Box>
              <Box sx={{
                mt: { xs: 2, md: 3 },
                color: 'white',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                fontWeight: '500',
                textAlign: { xs: 'center', md: 'right' },
                lineHeight: 1.1,
                opacity: 0.8,
              }}
              >
                <div dangerouslySetInnerHTML={{ __html: message }} />
              </Box>
            </Box>
            <StyledImage
              src="/logo_large.png"
              sx={{
                width: { xs: '250px', md: '400px', lg: '600px' },
                height: 'auto',
                objectFit: 'contain',
                ml: { xs: '45px', md: 0 },
              }}
              width={400}
              height={301}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
// <Box sx={{
//   width: { xs: '70%', md: '50%', xl: '40%' },
//   position: 'relative',
// }}
// >
//   <Box sx={{
//     display: { xs: 'none', md: 'block' },
//     color: 'white',
//     fontSize: { xs: '0px', sm: '32px', md: '60px', xl: '70px' },
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     fontWeight: '500',
//     textAlign: 'right',
//     lineHeight: 1.1,
//     transform: 'translateX(-100%)',
//     whiteSpace: 'pre',
//   }}
//   >
//     <div dangerouslySetInnerHTML={{ __html: translations.moduleVariables['Lets celebrate!'] }} />
//   </Box>
//   <StyledImage
//     src="/logo_large.png"
//     sx={{
//       width: '100%',
//       height: '100%',
//       objectFit: 'contain',
//     }}
//     width={400}
//     height={301}
//   />
// </Box>
// </Box>

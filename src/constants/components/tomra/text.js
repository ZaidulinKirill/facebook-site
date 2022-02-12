import { Box, Container, styled } from '@mui/material';
import React from 'react';
import { BackButton } from '../backButton';
import LanguageSelector from '../languageSelector';

const StyledImage = styled('img')({});
const StyledSpan = styled('span')({});

export const TomraText = ({
  id,
  size,
  marginTop,
  alignment,
  text,
  backButtonLabel,
  isBackButtonVisible,
  header,
  fontSize,
}) => (
  <Box
    sx={{
      display: 'flex',
      background: 'rgb(250, 213, 73)',
      paddingBottom: 6,
      position: 'relative',
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
    }}
    >
      <StyledImage
        src="/tomra_banner_background_2.svg"
        alt="bg"
        sx={{
          height: '600px',
          transform: 'rotate(0deg) translate(-50%,0)',
        }}
      />
    </Box>
    <Container maxWidth={size} sx={{ mt: marginTop, zIndex: 1 }}>
      <Box id={id} sx={{ display: 'flex', justifyContent: alignment }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
            <BackButton
              isVisible={isBackButtonVisible}
              label={backButtonLabel}
            />
            <Box
              sx={{
                px: 0,
                fontSize: {
                  lg: '2.2rem',
                  md: '1.8rem',
                  xs: '1.3rem',
                },
                fontWeight: 'bold',
              }}
            >
              <StyledSpan sx={{ display: 'block', textAlign: alignment }}>
                {header}
              </StyledSpan>
            </Box>
            <LanguageSelector
              color="inherit"
              sx={{ fontSize: 18, fontWeight: 'bold', marginLeft: 'auto' }}
            />
          </Box>
          <Box sx={{ mt: 0, fontSize, overflowY: 'hidden' }}>
            <Box
              dangerouslySetInnerHTML={{ __html: text }}
              sx={{ display: 'block', textAlign: alignment }}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  </Box>
);

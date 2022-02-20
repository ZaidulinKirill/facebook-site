import { Box, Container, styled } from '@mui/material';
import React from 'react';
import { BackButton } from '../backButton';

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
  <Box sx={{ pt: 7, pb: 10, backgroundColor: 'rgb(248, 163, 188)', position: 'relative', overflow: 'hidden' }}>
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
        src="/tomra_background_0_pink.svg"
        alt="bg"
        sx={{
          height: '300%',
          transform: 'rotate(-90deg) translate(-40%, -40%)',
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
          </Box>
          <Box sx={{ mt: 0, fontSize, overflowY: 'hidden', zIndex: 1 }}>
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

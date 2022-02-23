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
  <Box sx={{ py: 7, backgroundColor: 'rgb(236, 177, 189)', position: 'relative', overflow: 'hidden' }}>
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
        src="/tomra_background_pink.svg"
        alt="bg"
        sx={{
          height: '1500%',
          transform: 'rotate(0deg) translate(0%, -20%)',
        }}
      />
    </Box>
    <Container maxWidth={size} sx={{ mt: '32px', zIndex: 1 }}>
      <Box id={id} sx={{ display: 'flex', justifyContent: alignment }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 4 }}>
            <BackButton
              isVisible={isBackButtonVisible}
              label={backButtonLabel}
            />
            <Box
              sx={{
                px: 0,
              }}
            >
              <StyledSpan sx={{
                display: 'block',
                textAlign: alignment,
                color: 'black',
                zIndex: 1,
                fontSize: '2rem',
                paddingX: 2,
                fontWeight: '500',
              }}
              >
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

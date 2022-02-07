import { Box, styled } from '@mui/material';
import React from 'react';
import { useCurrentBreakpoint } from '../../../hooks';
import { getBreakpointValue } from '../../../utils/getBreakpointValue';

const StyledImage = styled('img')({});
const StyledSpan = styled('span')({});

const BannerPositions = {
  TOP_LEFT: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '& img': {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  },
  TOP_MIDDLE: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  TOP_RIGHT: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '& img': {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  },
  MIDDLE_LEFT: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  MIDDLE_RIGHT: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  BOTTOM_LEFT: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '& img': {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
  },
  BOTTOM_MIDDLE: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  BOTTOM_RIGHT: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '& img': {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
  },
};

export const TomraBanner = ({
  text, backgroundImageStyle, overlayColor, logo, textColor, font, enableShadow,
  fontSize = { xs: 96 }, logoWidth, bannerPosition = { xs: 'BOTTOM_RIGHT' },
}) => {
  const breakpoint = useCurrentBreakpoint();

  return (
    <Box
      id={1}
      sx={{
        height: '40vh',
        display: 'flex',
        alignItems: 'center',
        backgroundSize: 'cover',
        justifyContent: 'center',
        backgroundColor: 'rgb(13, 30, 52)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: { xs: 'center', sm: 'left' },
        ...backgroundImageStyle,
      }}
    >
      <Box sx={{ position: 'absolute', right: 0, bottom: 0, m: { xs: 0, sm: 2 } }}>
        <StyledImage src="/tomra_logo_white.png" alt="bg" sx={{ width: { xs: '150px', sm: '200px' } }} />
      </Box>
      <Box sx={{
        display: 'flex',
        padding: 4,
        ...BannerPositions[getBreakpointValue(bannerPosition, breakpoint)],
        backgroundColor: overlayColor,
      }}
      >
        {logo && (
          <Box sx={{ m: { xs: 0, md: 4 }, position: 'relative' }}>
            <StyledImage
              src={logo}
              width={400}
              sx={{ width: logoWidth }}
            />
          </Box>
        )}
        {text && (
          <StyledSpan sx={{
            color: textColor,
            fontSize,
            fontFamily: font,
            ...enableShadow && { textShadow: '1px 1px 6px black' },
          }}
          >
            {text}
          </StyledSpan>
        )}
      </Box>
    </Box>
  );
};

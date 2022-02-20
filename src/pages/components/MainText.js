import React, { useContext } from 'react';
import {
  Box, Container, Grid, styled,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PageRenderer } from '../../services';
import { PageContext } from '../../contexts';

const StyledImage = styled('img')({});

export function MainText() {
  const page = useContext(PageContext);
  const translations = page.modules.find((x) => x.moduleType === 'translations');

  const location = useLocation();
  const isRegistrationFlow = ['/login', '/signup', '/password'].includes(location?.pathname);

  const leftText = page.modules.find((x) => x.moduleType === (isRegistrationFlow ? 'registration-left-text' : 'main-left-text'));
  const rightText = page.modules.find((x) => x.moduleType === (isRegistrationFlow ? 'registration-right-text' : 'main-right-text'));

  return (
    <Box
      sx={{
        display: 'flex',
        background: 'rgb(254, 196, 9)',
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
          src="/tomra_background_5_yellow.svg"
          alt="bg"
          sx={{
            height: '200%',
            transform: { xs: 'translate(20%,30%)', md: 'translate(80%,30%)', lg: 'translate(100%,30%)' },
          }}
        />
      </Box>
      <Container maxWidth="xl" sx={{ zIndex: 1, display: 'flex', flexWrap: 'wrap', pt: 8, pb: 8 }}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <Box sx={{ fontSize: '2.5rem', lineHeight: 1.1 }}>{translations.moduleVariables['Ready to get this party started?']}</Box>
            {leftText && new PageRenderer({ modules: [leftText], inline: true }).render()}
          </Grid>
          <Grid item xs={12} md={8} sx={{ pl: { md: 4 }, mt: '-1em' }}>
            {rightText && new PageRenderer({ modules: [rightText], inline: true }).render()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

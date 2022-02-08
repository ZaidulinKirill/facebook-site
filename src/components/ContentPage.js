import { Box } from '@mui/material';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { TomraFooter } from '../constants/components/tomra/footer';
import { PageContext, SiteContext } from '../contexts';
import { PageRenderer } from '../services';

export default function ContentPage({ page }) {
  const { site: { fonts } } = useContext(SiteContext);
  const location = useLocation();

  const pageRenderer = new PageRenderer({
    ...page,
    fonts,
    modules: page.modules.filter((x) => x.moduleType === 'facebook-challenges'
      || x.moduleType === 'footer'
      || (!x.moduleType && location.pathname === '/')
      || (x.moduleType && x.moduleType.includes('facebook-challenge') && !['/login', '/signup', '/password'].includes(location.pathname))),
  });

  return (
    <Box sx={{ height: '100%', flex: '1 1 0', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <PageContext.Provider value={page}>
          {pageRenderer.render()}
        </PageContext.Provider>
      </Box>
      <Box sx={{ flexShring: 0 }}>
        <TomraFooter />
      </Box>
    </Box>
  );
}

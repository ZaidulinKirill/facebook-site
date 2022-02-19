import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TomraFooter } from '../constants/components/tomra/footer';
import { PageContext, SiteContext, UserContext } from '../contexts';
import { PageRenderer } from '../services';
import getLocalizedPath from '../utils/getLocalizedPath';

export default function ContentPage({ page }) {
  const userState = useState(null);
  const { site: { fonts } } = useContext(SiteContext);
  const [isInited, setIsInited] = useState(false);
  const location = useLocation();
  const { site: { id: siteId, language } } = useContext(SiteContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await axios.get(`/api/auth?userId=${siteId}`);
      if (!user.data) {
        navigate(getLocalizedPath(language, '/login'));
      }

      userState[1](user.data);
      setIsInited(true);
    })();
  }, []);

  if (!isInited) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const pageRenderer = new PageRenderer({
    ...page,
    fonts,
    modules: page.modules.filter((x) => x.moduleType === 'facebook-challenges'
      || x.moduleType === 'footer'
      || (!x.moduleType && location.pathname === '/')
      || (x.moduleType && x.moduleType.includes('facebook-challenge') && !['/login', '/signup', '/password'].includes(location.pathname))),
  });

  return (
    <UserContext.Provider value={userState}>
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
    </UserContext.Provider>
  );
}

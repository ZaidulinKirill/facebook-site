import axios from 'axios';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import {
  PageContext, SignupContext, SiteContext, UserContext,
} from '../contexts';
import getLocalizedPath from '../utils/getLocalizedPath';
import { PageRenderer } from '../services';
import { NotFoundPage } from '../components';
import LoginPage from './Login';
import SignupPage from './Signup';
import PasswordPage from './Password';
import AccountPage from './Account';
import MainPage from './Main';
import ChallengePage from './Challenge';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function RootNavigation({ page }) {
  const userState = useState(null);
  const signupState = useState(null);
  const { site: { fonts } } = useContext(SiteContext);
  const [isInited, setIsInited] = useState(false);
  const { site: { id: siteId, language } } = useContext(SiteContext);

  const navigate = useNavigate();

  const location = useLocation();
  const isNavbarEnabled = true; //! ['/login', '/signup', '/password'].includes(location?.pathname);
  const islargeNavbarEnabled = ['/'].includes(location?.pathname);

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

  const Navigation = useMemo(() => (
    <Routes>
      <Route
        caseSensitive={false}
        path="login"
        element={<LoginPage />}
      />
      <Route
        caseSensitive={false}
        path="signup"
        element={<SignupPage />}
      />
      <Route
        caseSensitive={false}
        path="password"
        element={<PasswordPage />}
      />
      <Route
        caseSensitive={false}
        path="account"
        element={<AccountPage />}
      />
      <Route
        caseSensitive={false}
        path="/"
        element={<MainPage />}
      />
      <Route
        caseSensitive={false}
        path=":id"
        element={<ChallengePage />}
      />
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  ), []);

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
    modules: [],
  });

  return (
    <PageContext.Provider value={page}>
      <SignupContext.Provider value={signupState}>
        <UserContext.Provider value={userState}>
          <Box sx={{ height: '100%', flex: '1 1 0', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1 }}>
              {isNavbarEnabled && <Navbar large={islargeNavbarEnabled} />}
              <Box id="main-content" sx={{ display: 'flex', flexDirection: 'column' }}>
                {pageRenderer.render(Navigation)}
              </Box>
            </Box>
            <Box sx={{ flexShring: 0 }}>
              <Footer />
            </Box>
          </Box>
        </UserContext.Provider>
      </SignupContext.Provider>
    </PageContext.Provider>
  );
}

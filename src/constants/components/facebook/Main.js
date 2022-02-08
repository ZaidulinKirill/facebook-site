import React, { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import {
  Route, BrowserRouter as Router, Routes, useNavigate,
} from 'react-router-dom';
import axios from 'axios';
import FacebookLogin from './Login';
import FacebookSignup from './Signup';
import FacebookChallenges from './Challenges';
import FacebookChallenge from './Challenge';
import { SignupContext, SiteContext, UserContext } from '../../../contexts';
import FacebookPassword from './Password';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import FacebookAccount from './Account';

export default function FacebookMain() {
  const userState = useState(null);
  const signupState = useState(null);
  const [isInited, setIsInited] = useState(false);
  const { site: { id: siteId, language } } = useContext(SiteContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await axios.get(`/api/auth?userId=${siteId}`);
      if (!user.data) {
        navigate(getLocalizedPath(language, '/login'));
      } else {
        // navigate(getLocalizedPath(language, '/'));
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

  return (
    <SignupContext.Provider value={signupState}>
      <Box>
        <div className="page-container">
          <Routes>
            <Route
              caseSensitive={false}
              path="login"
              element={<FacebookLogin />}
            />
            <Route
              caseSensitive={false}
              path="signup"
              element={<FacebookSignup />}
            />
            <Route
              caseSensitive={false}
              path="password"
              element={<FacebookPassword />}
            />
            <Route
              caseSensitive={false}
              path="account"
              element={<FacebookAccount />}
            />
            <Route
              caseSensitive={false}
              path="/"
              element={<FacebookChallenges />}
            />
            <Route
              caseSensitive={false}
              path=":id"
              element={<FacebookChallenge />}
            />
          </Routes>
        </div>
      </Box>
    </SignupContext.Provider>
  );
}

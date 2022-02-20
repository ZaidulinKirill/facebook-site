import React, { useContext } from 'react';
import emailValidator from 'email-validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, styled,
} from '@mui/material';
import {
  FormHandlerContext, PageContext, SignupContext, SiteContext,
} from '../contexts';
import { PageRenderer } from '../services';
import getLocalizedPath from '../utils/getLocalizedPath';
import { MainText } from './components/MainText';

const StyledImage = styled('img')({});

export default function LoginPage() {
  const page = useContext(PageContext);
  const [, setUser] = useContext(SignupContext);

  const form = page.modules.find((x) => x.moduleType === 'facebook-login-form');
  const { site: { language } } = useContext(SiteContext);

  const navigate = useNavigate();

  const modules = [
    form,
  ];

  const pageRenderer = new PageRenderer({ modules, inline: true });

  const onSubmit = async ({ siteId, ...item }) => {
    if (!emailValidator.validate(item.email)) {
      throw new Error('Wrong email format');
    }

    const { data: { isExists } } = await axios.post('/api/auth/check-user', { email: item.email, siteId });
    setUser({ siteId, ...item });

    if (isExists) {
      navigate(getLocalizedPath(language, '/password'));
    } else {
      navigate(getLocalizedPath(language, '/signup'));
    }
  };

  return (
    <Box>
      <MainText />
      <FormHandlerContext.Provider value={{ submit: onSubmit }}>
        {pageRenderer.render()}
      </FormHandlerContext.Provider>
    </Box>
  );
}

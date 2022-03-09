import React, { useContext } from 'react';
import emailValidator from 'email-validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  FormHandlerContext, PageContext, SignupContext, SiteContext,
} from '../contexts';
import { PageRenderer } from '../services';
import getLocalizedPath from '../utils/getLocalizedPath';
import { MainText } from './components/MainText';

export default function LoginPage() {
  const page = useContext(PageContext);
  const [, setUser] = useContext(SignupContext);
  const translations = page.modules.find((x) => x.moduleType === 'translations');

  const form = page.modules.find((x) => x.moduleType === 'facebook-login-form');
  const { site: { language } } = useContext(SiteContext);

  const navigate = useNavigate();

  const modules = [
    form,
  ];

  const pageRenderer = new PageRenderer({ modules, inline: true });

  const onSubmit = async ({ siteId, ...item }) => {
    if (!emailValidator.validate(item.email)) {
      throw new Error(translations.moduleVariables['Wrong email format']);
    }

    const specialEmails = ['cardcompiler@gmail.com', 'zaidulinkirill@gmail.com', 'info@rute98.be', 'www.stol.ru_96@mail.ru', 'petter.planke@outlook.com',
      'toring@absnet.no', 'info@rute98.be'];

    if (!item.email.trim().endsWith('@tomra.com') && !item.email.trim().endsWith('@pinkpinata.be') && !specialEmails.includes(item.email.trim())) {
      throw new Error(translations.moduleVariables['Wrong email domain']);
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

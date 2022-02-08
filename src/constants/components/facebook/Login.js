import React, { useContext } from 'react';
import emailValidator from 'email-validator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FormHandlerContext, PageContext, SignupContext, SiteContext,
} from '../../../contexts';
import { PageRenderer } from '../../../services';
import getLocalizedPath from '../../../utils/getLocalizedPath';

export default function FacebookLogin() {
  const page = useContext(PageContext);
  const [, setUser] = useContext(SignupContext);
  const banner = page.modules.find((x) => x.moduleType === 'facebook-registration-banner');
  const text = page.modules.find((x) => x.moduleType === 'facebook-login-text');
  const form = page.modules.find((x) => x.moduleType === 'facebook-login-form');
  const { site: { language } } = useContext(SiteContext);

  const navigate = useNavigate();

  if (!banner) {
    return;
  }

  const modules = [
    banner,
    text,
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
    <FormHandlerContext.Provider value={{ submit: onSubmit }}>
      {pageRenderer.render()}
    </FormHandlerContext.Provider>
  );
}

import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import {
  FormHandlerContext, PageContext, SignupContext, SiteContext,
} from '../contexts';
import { PageRenderer } from '../services';
import { MainText } from './components/MainText';

export default function SignupPage() {
  const page = useContext(PageContext);
  const { site: { language } } = useContext(SiteContext);
  const [user] = useContext(SignupContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const banner = page.modules.find((x) => x.moduleType === 'facebook-registration-banner');
  const text = page.modules.find((x) => x.moduleType === 'facebook-signup-text');
  const successText = page.modules.find((x) => x.moduleType === 'facebook-signup-success');
  const form = page.modules.find((x) => x.moduleType === 'facebook-signup-form');

  const submittedUser = useRef();

  if (!banner) {
    return;
  }

  const onSubmit = async ({ siteId, ...item }) => {
    await axios.post('/api/auth/signup', {
      name: item.name,
      lastName: item.lastName,
      country: item.country,
      department: item.department,
      position: item.position,
      avatarId: item.avatarId,
      password: item.password,
      email: user.email,
      siteId,
      languageId: language.id,
    });

    submittedUser.current = item;
    setIsSubmitted(true);
  };

  const withVariables = (item) => (item ? ({
    ...item,
    moduleVariables: {
      ...item.moduleVariables,
      text: item.moduleVariables.text
        .replace('[FIRSTNAME]', submittedUser.current?.name || '')
        .replace('[LASTNAME]', submittedUser.current?.lastName || '')
        .replace('[EMAIL]', user?.email),
    },
  }) : null);

  const modules = [
    banner,
    !isSubmitted && withVariables(text),
    !isSubmitted ? form : withVariables(successText),
  ].filter((x) => !!x);

  const pageRenderer = new PageRenderer({ modules, inline: true });

  return (
    <Box>
      <MainText />
      <FormHandlerContext.Provider value={{ submit: onSubmit }}>
        {pageRenderer.render()}
      </FormHandlerContext.Provider>
    </Box>
  );
}

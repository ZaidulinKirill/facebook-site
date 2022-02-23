/* eslint-disable react/no-danger */
import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import {
  FormHandlerContext, PageContext, SignupContext, SiteContext,
} from '../contexts';
import { PageRenderer } from '../services';
import { MainText } from './components/MainText';

export default function PasswordRecoveryPage() {
  const page = useContext(PageContext);
  const [user] = useContext(SignupContext);
  const { site: { language } } = useContext(SiteContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = page.modules.find((x) => x.moduleType === 'password-recovery-form');
  const successText = page.modules.find((x) => x.moduleType === 'password-recovery-success');

  const submittedUser = useRef();

  const onSubmit = async ({ siteId, ...item }) => {
    await axios.post('/api/auth/password-recovery', {
      email: item.email,
      siteId,
      languageId: language.id,
    });

    submittedUser.current = item;
    setIsSubmitted(true);
  };

  const withVariables = (item, key = 'text') => (item ? ({
    ...item,
    moduleVariables: {
      ...item.moduleVariables,
      [key]: (item.moduleVariables[key] || '').replace('[EMAIL]', submittedUser.current?.email || ''),
    },
  }) : null);

  const modules = [
    !isSubmitted ? form : withVariables(successText),
  ].filter((x) => !!x);

  const pageRenderer = new PageRenderer({ modules, inline: true });

  return (
    <Box>
      <MainText />
      <FormHandlerContext.Provider value={{ defaultItem: { email: user.email }, submit: onSubmit }}>
        {pageRenderer.render()}
      </FormHandlerContext.Provider>
    </Box>
  );
}

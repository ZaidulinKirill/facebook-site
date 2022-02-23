/* eslint-disable react/no-danger */
import React, { useContext } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { FormHandlerContext, PageContext, SiteContext } from '../contexts';
import { PageRenderer } from '../services';
import { MainText } from './components/MainText';

export default function NewPasswordPage() {
  const page = useContext(PageContext);
  const { site: { language } } = useContext(SiteContext);
  const form = page.modules.find((x) => x.moduleType === 'password-recovery-form');
  const [searchParams] = useSearchParams();
  const translations = page.modules.find((x) => x.moduleType === 'translations');

  const onSubmit = async ({ siteId, ...item }) => {
    if (item.password !== item.passwordConfirm) {
      throw new Error(translations.moduleVariables['[Error] Passwords do not match'] || 'Passwords do not match');
    }

    await axios.post('/api/auth/password-recovery-confirm', {
      tokenId: searchParams.get('t'),
      password: item.password,
      siteId,
      languageId: language.id,
    });

    window.location.href = '/';
  };

  const modules = [
    form,
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

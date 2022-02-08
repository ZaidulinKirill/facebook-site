import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';
import {
  FormHandlerContext, PageContext, SiteContext, UserContext,
} from '../../../contexts';
import { PageRenderer } from '../../../services';
import getLocalizedPath from '../../../utils/getLocalizedPath';

export default function FacebookAccount() {
  const page = useContext(PageContext);
  const { site: { language } } = useContext(SiteContext);
  const [user] = useContext(UserContext);

  const form = page.modules.find((x) => x.moduleType === 'facebook-account-form');

  const onSubmit = async ({ siteId, ...item }) => {
    await axios.post('/api/auth/account', {
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

    window.location.href = getLocalizedPath(language, '/');
  };

  const modules = [
    form,
  ];

  const pageRenderer = new PageRenderer({ modules, inline: true });

  return (
    <Box sx={{ }}>
      <FormHandlerContext.Provider value={{ submit: onSubmit, defaultItem: user }}>
        {pageRenderer.render()}
      </FormHandlerContext.Provider>
    </Box>
  );
}

/* eslint-disable react/no-danger */
import React, { useContext, useState } from 'react';
import axios from 'axios';
import {
  Box, Container, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FormHandlerContext, PageContext, SignupContext } from '../contexts';
import { PageRenderer } from '../services';
import { MainText } from './components/MainText';

export default function PasswordPage() {
  const page = useContext(PageContext);
  const [user] = useContext(SignupContext);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const form = page.modules.find((x) => x.moduleType === 'facebook-password-form');
  const wrongPasswordText = page.modules.find((x) => x.moduleType === 'facebook-password-wrong-password-text');
  const translations = page.modules.find((x) => x.moduleType === 'translations');

  const withVariables = (item, key = 'text') => (item ? ({
    ...item,
    moduleVariables: {
      ...item.moduleVariables,
      [key]: (item.moduleVariables[key] || '')
        .replace('[EMAIL]', user?.email),
    },
  }) : null);

  const modules = [
    withVariables(form, 'header'),
  ].filter((x) => !!x);

  const pageRenderer = new PageRenderer({ modules, inline: true });

  const onSubmit = async ({ siteId, ...item }) => {
    try {
      await axios.post('/api/auth/login', { email: user.email, password: item.password, siteId });
      window.location.href = '/';
    } catch (err) {
      setIsWrongPassword(true);
    }
  };

  return (
    <Box>
      <MainText />
      <FormHandlerContext.Provider value={{ submit: onSubmit }}>
        {isWrongPassword && wrongPasswordText && (
          <Dialog
            open={isWrongPassword}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={() => setIsWrongPassword(false)}
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div dangerouslySetInnerHTML={{
                  __html: wrongPasswordText.moduleVariables.text.replace('[EMAIL]', user?.email),
                }}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
        {pageRenderer.render()}
      </FormHandlerContext.Provider>
      <Container maxWidth="md">
        <Box sx={{ position: 'relative', p: 0, m: 0, height: 0 }}>
          <Link to="/password-recovery" style={{ position: 'absolute', bottom: '85px', right: 0, fontSize: '0.8rem', color: 'black' }}>
            {translations.moduleVariables['Forgot password?'] || 'Forgot password?'}
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

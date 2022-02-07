import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import { FormHandlerContext, PageContext, SignupContext } from '../../../contexts';
import { PageRenderer } from '../../../services';

export default function FacebookPassword() {
  const page = useContext(PageContext);
  const [user] = useContext(SignupContext);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const banner = page.modules.find((x) => x.moduleType === 'facebook-registration-banner');
  const text = page.modules.find((x) => x.moduleType === 'facebook-password-text');
  const form = page.modules.find((x) => x.moduleType === 'facebook-password-form');
  const wrongPasswordText = page.modules.find((x) => x.moduleType === 'facebook-password-wrong-password-text');

  if (!banner) {
    return;
  }

  const withVariables = (item) => (item ? ({
    ...item,
    moduleVariables: {
      ...item.moduleVariables,
      text: item.moduleVariables.text.replace('[EMAIL]', user?.email),
    },
  }) : null);

  const modules = [
    banner,
    withVariables(text),
    form,
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
  );
}

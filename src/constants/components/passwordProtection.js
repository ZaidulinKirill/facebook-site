import {
  Backdrop, Box, Button, Card,
  CardActions, CardContent, CardHeader,
  CircularProgress, TextField,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { PageContext, SiteContext } from '../../contexts';
import LanguageSelector from './languageSelector';

const { REACT_APP_API_URL } = process.env;

export const PasswordProtection = ({ title, subheader, loginButtonText, errorText, ...props }) => {
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { site } = useContext(SiteContext);
  const page = useContext(PageContext);
  const module = page.modules.find((x) => x.systemType === 'passwordProtection');

  function handlePasswordInput({ target: { value } }) {
    setPassword(value);
    setError(null);
  }

  async function login(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(`${REACT_APP_API_URL}/site/${site.id}/login?moduleId=${module.moduleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      window.location.reload();
    } catch (err) {
      setError(errorText);
    }

    setIsLoading(false);
  }

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
      transitionDuration={0}
    >
      <form onSubmit={login}>
        <Card sx={{ width: 350 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <CardHeader title={title} subheader={subheader} />
            <LanguageSelector sx={{ ml: 'auto', mt: 1.5, mr: 1 }} />
          </Box>

          <CardContent sx={{ pt: 0 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              onChange={handlePasswordInput}
            />
            {!!error && (<Box sx={{ mt: 1, color: 'var(--error-color)' }}>{error}</Box>)}
          </CardContent>
          <CardActions>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={!password || !password.length}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ ml: 2, color: 'var(--primary-text-color)' }} />
              ) : (
                'Login'
              )}
            </Button>
          </CardActions>
        </Card>
      </form>
    </Backdrop>
  );
};

import { Box } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { TextValidator as BaseTextField } from 'react-material-ui-form-validator';
import { useLocation } from 'react-router-dom';
import { FormContext, PageContext } from '../../../contexts';

export const TextField = ({ fullWidth = true, required, ...props }) => {
  const page = useContext(PageContext);
  const location = useLocation();

  const translations = page.modules.find((x) => x.moduleType === 'translations');

  const isPassword = props.name === 'password' || props.name === 'confirm-password';
  const isSignupPage = ['/signup', '/account', '/new-password'].find((x) => location.pathname.includes(x));

  const validators = useMemo(() => {
    if (!required && !isPassword) {
      return [];
    }

    if (!required && isPassword) {
      return [];
    }

    if (!isPassword || !isSignupPage) {
      return ['required'];
    }

    return ['required', 'minStringLength:10', 'matchRegexp:[a-z]', 'matchRegexp:[A-Z]', 'matchRegexp:[^a-zA-Z]'];
  }, [isPassword, required, isSignupPage]);

  const errorMessages = useMemo(() => {
    if (!required && !isPassword) {
      return [];
    }

    if (!required && isPassword) {
      return [];
    }

    if (!isPassword || !isSignupPage) {
      return [translations.moduleVariables['[Error] Required']];
    }

    return [
      translations.moduleVariables['[Error] Required'],
      translations.moduleVariables['[Error] Min password length'],
      translations.moduleVariables['[Error] Password should contain upper and lower letters'],
      translations.moduleVariables['[Error] Password should contain upper and lower letters'],
      translations.moduleVariables['[Error] Password should contain special symbols'],
    ];
  }, [isPassword, required, isSignupPage]);

  return (
    <FormContext.Consumer>
      {({ form }) => (
        <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
          <BaseTextField
            fullWidth={fullWidth}
            type={isPassword ? 'password' : undefined}
            validators={validators}
            errorMessages={errorMessages}
            {...props}
          />
        </Box>
      )}
    </FormContext.Consumer>
  );
};

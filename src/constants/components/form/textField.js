import { Box } from '@mui/material';
import React from 'react';
import { TextValidator as BaseTextField } from 'react-material-ui-form-validator';
import { FormContext } from '../../../contexts';

export const TextField = ({ fullWidth = true, required, ...props }) => (
  <FormContext.Consumer>
    {({ form }) => (
      <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
        <BaseTextField
          fullWidth={fullWidth}
          type={props.name === 'password' ? 'password' : undefined}
          validators={[
            ...required ? ['required'] : [],
          ]}
          errorMessages={[
            ...required ? [form.fields.requiredFieldMessage] : [],
          ]}
          {...props}
        />
      </Box>
    )}
  </FormContext.Consumer>
);

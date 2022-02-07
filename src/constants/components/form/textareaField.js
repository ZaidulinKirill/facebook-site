import { Box } from '@mui/material';
import React from 'react';
import { TextValidator as BaseTextField } from 'react-material-ui-form-validator';
import { FormContext } from '../../../contexts';

export const TextareaField = ({ requiredLabel, fullWidth = true, minRows = 3, required, ...props }) => (
  <FormContext.Consumer>
    {({ form }) => (
      <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
        <BaseTextField
          fullWidth={fullWidth}
          minRows={minRows}
          multiline
          validators={[
            ...required ? ['required'] : [],
          ]}
          errorMessages={[
            ...required ? [requiredLabel || form.fields.requiredFieldMessage] : [],
          ]}
          {...props}
        />
      </Box>
    )}
  </FormContext.Consumer>
);

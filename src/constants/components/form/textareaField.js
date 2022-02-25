import { Box } from '@mui/material';
import React from 'react';
import { TextValidator as BaseTextField } from 'react-material-ui-form-validator';
import { PageContext } from '../../../contexts';

export const TextareaField = ({ requiredLabel, fullWidth = true, minRows = 3, required, ...props }) => (
  <PageContext.Consumer>
    {(page) => {
      const translations = page.modules.find((x) => x.moduleType === 'translations');
      return (
        <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
          <BaseTextField
            fullWidth={fullWidth}
            minRows={minRows}
            multiline
            validators={[
              ...required ? ['required'] : [],
            ]}
            errorMessages={[
              ...required ? [requiredLabel || translations.moduleVariables['[Error] Required']] : [],
            ]}
            {...props}
          />
        </Box>
      );
    }}
  </PageContext.Consumer>
);

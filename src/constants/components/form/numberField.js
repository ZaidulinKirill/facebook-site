import { Box } from '@mui/material';
import React from 'react';
import { TextValidator as BaseTextField } from 'react-material-ui-form-validator';
import { PageContext } from '../../../contexts';

export const NumberField = ({ fullWidth = true, required, ...props }) => (
  <PageContext.Consumer>
    {({ page }) => {
      const translations = page.modules.find((x) => x.moduleType === 'translations');

      return (
        <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
          <BaseTextField
            fullWidth={fullWidth}
            validators={[
              ...required ? ['required'] : [],
            ]}
            errorMessages={[
              ...required ? [translations.moduleVariables['[Error] Required']] : [],
            ]}
            {...props}
            type="number"
          />
        </Box>
      );
    }}
  </PageContext.Consumer>
);

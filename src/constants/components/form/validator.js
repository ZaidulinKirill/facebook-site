import React from 'react';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import { Box } from '@mui/material';
import { FormContext, PageContext } from '../../../contexts';

export class ValidatorElement extends ValidatorComponent {
  renderValidatorComponent() {
    return this.errorText();
  }

  errorText() {
    const { isValid } = this.state;
    if (isValid) {
      return null;
    }

    return (
      <PageContext.Consumer>
        {({ page }) => {
          const translations = page.modules.find((x) => x.moduleType === 'translations');

          return (
            <Box sx={{ color: 'var(--error-color)', mt: 0.3 }}>
              {translations.moduleVariables['[Error] Required']}
            </Box>
          );
        }}
      </PageContext.Consumer>
    );
  }
}

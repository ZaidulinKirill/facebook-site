import React from 'react';
import { ValidatorComponent } from 'react-material-ui-form-validator';
import { Box } from '@mui/material';
import { FormContext } from '../../../contexts';

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
      <FormContext.Consumer>
        {({ form }) => (
          <Box sx={{ color: 'var(--error-color)', mt: 0.3 }}>
            {form.fields.requiredFieldMessage }
          </Box>
        )}
      </FormContext.Consumer>
    );
  }
}

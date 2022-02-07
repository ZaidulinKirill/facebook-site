import React from 'react';
import {
  Box, Checkbox as CheckboxBase, FormControlLabel, FormGroup,
} from '@mui/material';
import { ValidatorElement } from './validator';

export const CheckboxField = ({ required, fullWidth, value, label, onChange, ...props }) => {
  const onValueChanged = (event, checked) => {
    onChange({ target: { value: checked } });
  };

  return (
    <Box sx={{ color: 'var(--text-primary)' }}>
      <FormGroup>
        <FormControlLabel
          control={<CheckboxBase onChange={onValueChanged} checked={value} {...props} />}
          label={<span dangerouslySetInnerHTML={{ __html: label }} />}
        />
      </FormGroup>
      <ValidatorElement
      // eslint-disable-next-line no-nested-ternary
        value={required ? (value === false ? undefined : value) : value}
        validators={[
          ...required ? ['required'] : [],
        ]}
      />
    </Box>
  );
};

import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio as RadioBase,
  RadioGroup,
} from '@mui/material';
import { ValidatorElement } from './validator';

export const RadioField = ({ required, fullWidth = true, label, items, key, ...props }) => (
  <Box sx={{ color: 'var(--text-primary)' }}>
    <FormControl component="fieldset" key={key} fullWidth={fullWidth}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup {...props}>
        {items.map((item) => (
          <FormControlLabel value={item.value} control={<RadioBase />} label={item.text} key={item.id} />
        ))}
      </RadioGroup>
    </FormControl>
    <ValidatorElement
      value={props.value}
      validators={[
        ...required ? ['required'] : [],
      ]}
    />
  </Box>
);

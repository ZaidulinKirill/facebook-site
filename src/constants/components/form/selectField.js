import React from 'react';
import {
  Select as BaseSelect, Box, FormControl, InputLabel, MenuItem,
} from '@mui/material';
import { ValidatorElement } from './validator';

export const SelectField = ({ fullWidth = true, required, value, onChange, label, items, variant, key, ...props }) => (
  <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
    <FormControl fullWidth={fullWidth} variant={variant} key={key}>
      <InputLabel>{label}</InputLabel>
      <BaseSelect
        value={value}
        label={label}
        onChange={onChange}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            style: {
              maxHeight: 300,
              width: 250,
            },
          },
        }}
        {...props}
      >
        {items.map((item) => (<MenuItem value={item.value} key={item.id}>{item.text}</MenuItem>))}
      </BaseSelect>
    </FormControl>
    <ValidatorElement
      value={value}
      validators={[
        ...required ? ['required'] : [],
      ]}
    />
  </Box>
);

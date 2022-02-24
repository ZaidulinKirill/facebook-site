import React, { useMemo } from 'react';
import {
  Select as BaseSelect, Box, FormControl, InputLabel, MenuItem,
} from '@mui/material';
import { ValidatorElement } from './validator';
import { Countries } from '../../countries';
import { Divisions } from '../../divisions';

export const SelectField = ({ fullWidth = true, required, value, onChange, label, items, variant, key, ...props }) => {
  const realItems = useMemo(() => {
    if (props.name === 'department') {
      return Divisions;
    }

    if (props.name === 'country') {
      return Countries;
    }

    return items;
  }, [props.name, items]);

  return (
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
          {realItems.map((item) => (<MenuItem value={item.value} key={item.id}>{item.text}</MenuItem>))}
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
};

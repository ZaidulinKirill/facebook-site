import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
} from '@mui/material';
import { SketchPicker } from 'react-color';
import fontColorContrast from 'font-color-contrast';

export const ColorField = ({ fullWidth = true, label, key, value, onChange }) => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [color, setColor] = useState(value);

  const textColor = useMemo(() => (!value ? 'black' : fontColorContrast(value)), [value]);

  useEffect(() => {
    if (isDialogOpened) {
      setColor(value);
    }
  }, [isDialogOpened]);

  return (
    <Box sx={{ color: 'var(--text-primary)' }}>
      {isDialogOpened && (
        <Dialog
          open={isDialogOpened}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={() => setIsDialogOpened(false)}
        >
          <DialogContent sx={{ padding: 0,
            display: 'flex',
            justifyContent: 'center',
            '& .sketch-picker': { boxShadow: 'none !important' } }}
          >
            <SketchPicker
              color={color}
              disableAlpha
              onChange={((e) => setColor(e.hex))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpened(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsDialogOpened(false);
              onChange({ target: { value: color } });
            }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <FormControl component="fieldset" key={key} fullWidth={fullWidth}>
        {label && <FormLabel component="legend">{label}</FormLabel>}
        <Box
          sx={{
            ...value && { backgroundColor: value },
            mt: 1,
            border: 'thin solid gray',
            height: '48px',
            width: '100px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
          }}
          onClick={() => setIsDialogOpened(true)}
        >
          Text
        </Box>
      </FormControl>
    </Box>
  );
};

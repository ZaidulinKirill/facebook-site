import React, { useContext } from 'react';
import { Box } from '@mui/material';
import { EventContext } from '../../contexts';

export default function EventEmitter({ event, eventName, eventArgs = [], sx, children }) {
  const { emit } = useContext(EventContext);

  console.log(event, eventName, eventArgs);
  const handleClick = () => {
    console.log('here');
    emit(eventName || event, eventArgs);
  };

  const hanlders = {
    click: { onClick: handleClick },
  };

  return (
    <Box sx={{ cursor: 'pointer', ...sx }} {...hanlders[event]}>
      {children}
    </Box>
  );
}

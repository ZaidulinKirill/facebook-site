import React, { useCallback, useState } from 'react';
import CountdownBase from 'react-countdown';
import { Box } from '@mui/material';

export const Countdown = ({
  daysInHours = true,
  fontSize = { md: 128, sm: 100, xs: 64 },
  date, sx,
  daysLabel = 'Days',
  hoursLabel = 'Hours',
  minutesLabel = 'Minutes',
  secondsLabel = 'Seconds',
  ...props
}) => {
  const [isFinished, setIsFinished] = useState(false);

  const renderer = useCallback(({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return null;
    }

    return (
      <Box
        className="countdown-container"
        sx={{
          display: 'flex',
          lineHeight: 1,
          '& > div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            lineHeight: 1,
            '& > span': {
              fontSize: Object.assign({}, ...Object.entries(fontSize).map(([key, value]) => ({ [key]: `calc(${value}px / 7)` }))),
              overflow: 'visible',
              height: 0,
            },
          },
          fontSize,
          ...sx,
        }}
      >
        {days > 0 ? (
          <>
            <Box className="days">
              {days}
              <span>{daysLabel}</span>
            </Box>
            :
          </>
        ) : null}
        <Box className="hour">
          {hours.toString().padStart(2, '0')}
          <span>{hoursLabel}</span>
        </Box>
        :
        <Box className="minute">
          {minutes.toString().padStart(2, '0')}
          <span>{minutesLabel}</span>
        </Box>
        :
        <Box className="second">
          {seconds.toString().padStart(2, '0')}
          <span>{secondsLabel}</span>
        </Box>
      </Box>
    );
  }, [sx]);

  if (!date) {
    return null;
  }

  if ((new Date(date).valueOf() < new Date().valueOf()) || isFinished) {
    return null;
  }

  return (
    <CountdownBase
      date={new Date(date)}
      renderer={renderer}
      daysInHours={daysInHours}
      onComplete={() => { setIsFinished(true); }}
      {...props}
    />
  );
};

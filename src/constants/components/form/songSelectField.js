import React from 'react';
import {
  Autocomplete, Box, Grid, TextField,
  Typography,
} from '@mui/material';
import throttle from 'lodash.throttle';
import { ValidatorElement } from './validator';

const { REACT_APP_API_URL } = process.env;

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, escape);
}

export const SongSelectField = ({
  fullWidth = true, value, required, onChange, label, noOptionsText, loadingText, ...props
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const throttledFetch = React.useMemo(
    () => throttle(async (request, callback) => {
      if (!request) {
        callback([]);
        return;
      }

      setIsLoading(true);

      const response = await fetch(`https://itunes.apple.com/search?media=music&entity=musicTrack&term=${fixedEncodeURIComponent(request)}&limit=10`, {
        method: 'get',
        mode: 'cors',
        redirect: 'manual',
        headers: {
          'User-Agent': 'PostmanRuntime/7.28.4',
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      try {
        const { results } = await response.json();

        const uniqueResults = Object.values(results
          .reverse()
          .reduce((acc, item) => {
            const trackId = `${item.artistId} - ${item.trackName}`.trim();
            acc[trackId] = acc[trackId] || { ...item, trackId };

            return acc;
          }, {}))
          .reverse();

        callback(uniqueResults);
        setIsLoading(false);
      } catch (err) {
        callback([]);
        setIsLoading(false);
      }
    }, 400),
    [],
  );

  React.useEffect(() => {
    let isMounted = true;

    throttledFetch(inputValue, (results) => {
      if (isMounted) {
        setOptions(results);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [inputValue, throttledFetch]);

  return (
    <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
      <Autocomplete
        noOptionsText={noOptionsText}
        loadingText={loadingText}
        getOptionLabel={(option) => `${option.artistName} - ${option.trackName}`}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        loading={isLoading}
        fullWidth={fullWidth}
        includeInputInList={false}
        filterSelectedOptions
        onChange={(event, newValue) => {
          onChange({ target: { value: newValue } });
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} fullWidth {...props} />
        )}
        renderOption={(optionProps, option) => (
          <li {...optionProps} key={option.trackId}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="img" alt="Preview" src={option.artworkUrl100} sx={{ borderRadius: 2, width: '64px', height: '64px', objectFit: 'cover' }} />
              </Grid>
              <Grid item xs sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ margin: 0, padding: 0 }}>
                  <b>{option.artistName}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ margin: 0, padding: 0 }}>
                  {option.trackName}
                </Typography>
              </Grid>
            </Grid>
          </li>
        )}
      />

      <ValidatorElement
        {...value && { value }}
        validators={[
          ...required ? ['required'] : [],
        ]}
      />
    </Box>
  );
};

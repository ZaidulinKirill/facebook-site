import { Box } from '@mui/material';
import React from 'react';
import 'react-h5-audio-player/lib/styles.css';

export default function AudioPlayer({ id, items, marginBottom }) {
  // https://www.dropbox.com/s/7zacs7it2m0ih4z/2022-01-27-13-00-00-PGM%20MET%20PROC.wav?dl=0&raw=1

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} id={id}>
      {items.map((item) => (
        <Box key={item.src} sx={{ marginBottom: 2 }}>
          {item.description?.length && (<div dangerouslySetInnerHTML={{ __html: item.description }} />)}
          {(item.src || item.dropboxUrl) && (
            <audio src={item.dropboxUrl?.length ? `${item.dropboxUrl }&raw=1` : `/api/uploads/${item.src}?range=true`} style={{ width: '100%' }} controls>
              <track kind="captions" />
            </audio>
          )}
        </Box>
      ))}
    </Box>
  );
}

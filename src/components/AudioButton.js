import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, styled } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const StyledButton = styled(Box)({
  borderRadius: '100%',
  backgroundColor: 'var(--primary-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all .1s ease-in-out',
  '& svg': {
    transition: 'all .1s ease-in-out',
    color: 'var(--primary-text-color)',
  },
  '&:hover': {
    filter: 'brightness(0.80)',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
  },
});

export function AudioButton({ url, size = '40px', iconSize = '26px', onPlay, reset }) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    if (reset) {
      stopAudio();
    }
  }, [reset]);

  async function playAudio() {
    if (audioRef) {
      stopAudio();
    }

    const audio = new Audio();

    if (onPlay) {
      onPlay();
    }

    try {
      setIsLoading(true);

      await new Promise((resolve, reject) => {
        audio.preload = 'auto';
        audio.autoplay = true;
        audio.loop = true;
        audio.onerror = reject;
        audio.onplaying = resolve;

        audio.src = url;
      });
    } catch (err) {
      console.error(err);
      stopAudio();
    }

    setAudioRef(audio);
    setIsLoading(false);
  }

  function stopAudio() {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;

      setAudioRef(null);
    }
  }

  function handleClick() {
    if (audioRef) {
      stopAudio();
    } else {
      playAudio();
    }
  }

  return (
    <StyledButton
      onClick={handleClick}
      sx={{
        width: size,
        height: size,
      }}
    >
      {!isLoading && !audioRef && <PlayArrowIcon sx={{ fontSize: iconSize }} />}
      {!isLoading && audioRef && <PauseIcon sx={{ fontSize: iconSize }} />}
      {isLoading && <CircularProgress />}
    </StyledButton>
  );
}

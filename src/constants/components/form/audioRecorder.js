import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Box, Button, FormLabel, IconButton, ThemeProvider, Typography, createTheme, useTheme,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useReactMediaRecorder } from 'react-media-recorder';
import { FormContext } from '../../../contexts';
import { ValidatorElement } from './validator';

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

export const AudioRecorder = ({
  label, recordLabel, stopLabel, playLabel, stopPlayingLabel, color, onChange, marginTop, required, alignment, ...props
}) => {
  try {
    if (isIE11) {
      throw new Error('IE is not supported');
    }

    const { isSaving } = useContext(FormContext);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [resultUrl, setResultUrl] = useState(false);
    const currentTheme = useTheme();

    const audio = useRef();
    const {
      status,
      startRecording,
      stopRecording,
      mediaBlobUrl,
      clearBlobUrl,
      error,
    } = useReactMediaRecorder({ audio: true });

    const onClick = () => {
      if (resultUrl) {
        if (audio.current) {
          audio.current.pause();
          audio.current = null;
          setIsPlaying(false);
        } else {
          audio.current = new Audio(mediaBlobUrl);
          audio.current.play();
          audio.current.addEventListener('ended', () => {
            onClick();
          });

          setIsPlaying(true);
        }

        return;
      }

      if (!isRecording) {
        startRecording();
      } else {
        stopRecording();
      }
    };

    const onReset = () => {
      clearBlobUrl();
    };

    useEffect(() => {
      setIsRecording(['recording', 'stopping'].includes(status));
    }, [status]);

    useEffect(() => {
      setResultUrl(mediaBlobUrl);
      onChange({ target: { value: mediaBlobUrl } });
    }, [mediaBlobUrl]);

    if (error) {
      return <Typography sx={{ color: 'var(--error-color)', mt: 1 }}>{error}</Typography>;
    }

    const getButtonState = () => {
      if (isRecording) {
        return { ButtonIcon: () => <MicOffIcon sx={{ mr: 1 }} />, text: stopLabel };
      }

      if (resultUrl && !isPlaying) {
        return { ButtonIcon: () => <PlayArrowIcon sx={{ mr: 1 }} />, text: playLabel };
      }

      if (resultUrl && isPlaying) {
        return { ButtonIcon: () => <StopIcon sx={{ mr: 1 }} />, text: stopPlayingLabel };
      }

      return { ButtonIcon: () => <MicIcon sx={{ mr: 1 }} />, text: recordLabel };
    };

    const { ButtonIcon, text: buttonLabel } = getButtonState();

    const newTheme = createTheme({
      ...currentTheme,
      ...color && {
        palette: {
          ...currentTheme.palette,
          primary: {
            main: color,
          },
        },
      },
    });

    return (
      <ThemeProvider theme={newTheme}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: alignment, pt: marginTop }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
            {label && <FormLabel component="legend" sx={{ mb: 1 }}>{label}</FormLabel>}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button disabled={isSaving} {...props} onClick={onClick}>
                <ButtonIcon sx={{ mr: 1 }} />
                {buttonLabel}
              </Button>
              {resultUrl && (
                <IconButton onClick={onReset} sx={{ ml: 1, p: 0.6 }}>
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          <ValidatorElement
            value={props.value}
            validators={[
              ...required ? ['required'] : [],
            ]}
          />
        </Box>
      </ThemeProvider>
    );
  } catch (err) {
    return (
      <Box sx={{ color: 'red' }}>
        Please, use another browser for audio recording
      </Box>
    );
  }
};

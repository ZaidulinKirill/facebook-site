import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Box, Button, Dialog, DialogActions,
  FormLabel, IconButton, Menu, MenuItem,
  ThemeProvider, createTheme, styled,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useReactMediaRecorder } from 'react-media-recorder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import isMobile from 'is-mobile';
import { FormContext } from '../../../contexts';
import { ValidatorElement } from './validator';

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }

  return (
    <video ref={videoRef} width="100%" autoPlay>
      <track kind="captions" />
    </video>
  );
};

const Input = styled('input')({
  display: 'none',
});

export const UploadButton = ({
  label, uploadLabel = 'Upload', downloadFileLabel = 'File', cancelLabel = 'Cancel',
  confirmRecordingLabel = 'Confirm', stopRecordingLabel = 'Stop recording',
  recordVideoMenuLabel = 'Record video', uploadFileMenuLabel = 'Upload file',
  color, onChange, marginTop, required, alignment, accept, ...props
}) => {
  try {
    if (isIE11) {
      throw new Error('IE is not supported');
    }

    const { isSaving } = useContext(FormContext);
    const [resultUrl, setResultUrl] = useState(false);
    const [isWebcamDialogOpened, setIsWebcamDialogOpened] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const onClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const currentTheme = useTheme();

    const {
      startRecording,
      stopRecording,
      mediaBlobUrl,
      clearBlobUrl,
      previewStream,
      error,
    } = useReactMediaRecorder({ video: true });

    const onReset = () => {
      if (mediaBlobUrl) {
        clearBlobUrl();
      }

      setResultUrl(null);
    };

    useEffect(() => {
      setIsWebcamDialogOpened(false);
      setAnchorEl(null);
    }, [error]);

    useEffect(() => {
      onChange({ target: { value: resultUrl } });
    }, [resultUrl]);

    useEffect(() => {
      if (isWebcamDialogOpened) {
        startRecording();
        onReset();
      } else {
        stopRecording();
      }
    }, [isWebcamDialogOpened]);

    const getButtonState = () => ({ ButtonIcon: () => <CloudUploadIcon sx={{ mr: 1 }} />, text: uploadLabel });

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

    const onStopRecordingPressed = () => {
      if (!mediaBlobUrl) {
        stopRecording();
      } else {
        setIsWebcamDialogOpened(false);
        setResultUrl(mediaBlobUrl);
        setAnchorEl(null);
      }
    };

    const downloadBlob = async (e) => {
      e.preventDefault();

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';

      const blob = await fetch(resultUrl).then((r) => r.blob());
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.target = '_blank';
      a.download = 'File';
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const isModeSelectionEnabled = !isMobile() && !accept;

    return (
      <ThemeProvider theme={newTheme}>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: alignment, pt: marginTop }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column' }}>
            {label && <FormLabel component="legend" sx={{ mb: 1 }}>{label}</FormLabel>}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {
                isModeSelectionEnabled
                  ? (
                    <Button disabled={isSaving} {...props} onClick={onClick}>
                      <ButtonIcon sx={{ mr: 1 }} />
                      {buttonLabel}
                    </Button>
                  )
                  : (
                    <label htmlFor="button-file">
                      <Input
                        id="button-file"
                        type="file"
                        accept={accept}
                        onChange={({ target }) => {
                          setResultUrl(target.files.length ? URL.createObjectURL(target.files[0]) : null);
                          setAnchorEl(null);
                        }}
                      />
                      <Button disabled={isSaving} {...props} component="span">
                        <ButtonIcon sx={{ mr: 1 }} />
                        {buttonLabel}
                      </Button>
                    </label>
                  )
              }
              {resultUrl && (
                <Button onClick={downloadBlob} sx={{ ml: 1 }}>
                  {downloadFileLabel}
                </Button>
              )}
              {resultUrl && (
                <IconButton onClick={onReset} sx={{ ml: 0, p: 0.6 }}>
                  <CloseIcon />
                </IconButton>
              )}
              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={() => setIsWebcamDialogOpened(true)} disabled={!!error}>
                  <PhotoCameraIcon sx={{ mr: 1 }} />
                  {recordVideoMenuLabel}
                </MenuItem>
                <label htmlFor="button-file-2">
                  <Input
                    type="file"
                    id="button-file-2"
                    accept={accept}
                    onChange={({ target }) => {
                      setResultUrl(target.files.length ? URL.createObjectURL(target.files[0]) : null);
                      setAnchorEl(null);
                    }}
                  />
                  <MenuItem onClick={() => {}}>
                    <AttachFileIcon sx={{ mr: 1 }} />
                    {uploadFileMenuLabel}
                  </MenuItem>
                </label>
              </Menu>
            </Box>
          </Box>
          <ValidatorElement
            value={props.value}
            validators={[
              ...required ? ['required'] : [],
            ]}
          />
        </Box>
        <Dialog
          open={isWebcamDialogOpened}
        >
          <Box>
            {!isModeSelectionEnabled
              ? <Box sx={{ display: 'flex', justifyContent: 'center' }}>Recording...</Box>
              : (previewStream && !mediaBlobUrl && <VideoPreview stream={previewStream} />)}
            {!!mediaBlobUrl && <video src={mediaBlobUrl} width="100%" autoPlay controls><track kind="captions" /></video>}
          </Box>
          <DialogActions>
            <Button onClick={() => setIsWebcamDialogOpened(false)}>
              {cancelLabel}
            </Button>
            <Button onClick={onStopRecordingPressed} variant="contained">
              {!mediaBlobUrl ? stopRecordingLabel : confirmRecordingLabel}
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  } catch (err) {
    console.error(err);
    return (
      <Box sx={{ color: 'red' }}>
        Please, use another browser for audio recording
      </Box>
    );
  }
};

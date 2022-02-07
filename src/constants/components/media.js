import { Box, CircularProgress, styled } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { ThemeProvider } from './themeProvider';
import { SiteContext } from '../../contexts';

const { REACT_APP_API_URL } = process.env;
const isMobileSafari = navigator && (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') <= -1 && navigator.userAgent.indexOf('iPhone') === -1 && navigator.userAgent.indexOf('iPad') === -1);

const Modes = {
  INITIAL: 'INITIAL',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
};

const Image = styled('img')({});
const StyledActionButton = styled(Box)({
  borderRadius: '100%',
  backgroundColor: 'var(--primary-color)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '78px',
  height: '78px',
  cursor: 'pointer',
  transition: 'all .1s ease-in-out',
  '& svg, & img': {
    transition: 'all .1s ease-in-out',
    color: 'var(--primary-text-color)',
  },
  '&:hover': {
    filter: 'brightness(0.80)',
  },
  '&:hover svg, &:hover img': {
    transform: 'scale(1.1)',
  },
});

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '14px',
    backgroundColor: theme.palette.common.black,
  },
}));

const ActionButton = ({ color, tooltip, ...props }) => (
  <ThemeProvider primaryColor={color}>
    <BootstrapTooltip title={tooltip}>
      <StyledActionButton {...props} />
    </BootstrapTooltip>
  </ThemeProvider>
);

const VideoPlayer = (props) => {
  const onReady = (player) => {
    const internalPlayer = player.getInternalPlayer();
    internalPlayer.play();
  };

  return (
    <ReactPlayer
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      width="100%"
      height="100%"
      onReady={onReady}
      {...props}
    />
  );
};

const AudioPlayer = ({ setRef, controls, ...props }) => {
  useEffect(() => {
    if (isMobileSafari) {
      const audio = new Audio(props.url);
      setRef(audio);

      return () => {
        if (audio) {
          audio.pause();
        }
      };
    }
  }, []);

  if (isMobileSafari) {
    return null;
  }

  const onReady = (player) => {
    const internalPlayer = player.getInternalPlayer();
    setRef(internalPlayer);
  };

  return (
    <ReactPlayer
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      width="100%"
      height="100%"
      onReady={onReady}
      playsinline
      muted={false}
      stopOnUnmount
      {...props}
    />
  );
};

export const Media = ({
  id, activeColor, videoProps, radioProps, ratio = '56.25', sx, title,
  teamsLink, teamsIcon, videoTooltip, audioTooltip, teamsTooltip,
  showAudioButton, showVideoButton, showTeamsLink,
}) => {
  const { site: { id: siteId, userId } } = useContext(SiteContext);
  const [mode, setMode] = useState(showVideoButton ? Modes.VIDEO : Modes.INITIAL);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [audioRef, setAudioRef] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioStopped, setIsAudioStopped] = useState(!showVideoButton);
  const [isPreloadHidden, setIsPreloadHidden] = useState(false);

  useEffect(() => {
    if (audioRef) {
      playRadio();
    }
  }, [audioRef]);

  async function playRadio() {
    try {
      audioRef.play();
      setIsAudioPlaying(true);
    } catch (err) {
      console.error(err);
    }
  }

  function stopRadio() {
    try {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsAudioPlaying(false);
      setIsAudioStopped(true);
    } catch (err) {
      console.error(err);
    }
  }

  function handleVideoButtonClick() {
    setMode(Modes.VIDEO);
    if (audioRef) {
      audioRef.pause();
    }
    setAudioRef(null);
  }

  function handleRadioButtonClick() {
    setIsVideoMuted(false);
    setMode(Modes.AUDIO);

    if (audioRef) {
      if (isAudioPlaying) {
        stopRadio();
      } else {
        setAudioRef(null);
        setIsAudioStopped(false);
      }
    } else {
      setIsAudioStopped(false);
    }
  }

  function handleTeamsButtonClick() {
    window.open(teamsLink, '_blank');
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`${REACT_APP_API_URL}/stats/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: userId, siteId, type: mode }),
      });
    }, 1000 * 30);

    return () => {
      clearTimeout(timeout);
    };
  }, [mode]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} id={id}>
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          paddingBottom: `${ratio}%`, // Player ratio: 100 / (1280 / 720)
          ...sx,
        }}
      >
        <Box display="none">
          {radioProps && radioProps.url && !isPreloadHidden && (
            <AudioPlayer
              url={radioProps.url}
              setRef={() => {
                setIsPreloadHidden(true);
              }}
            />
          )}
        </Box>
        {
          mode === Modes.VIDEO ? (
            <VideoPlayer {...videoProps} muted={isVideoMuted} />
          ) : (
            <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} width="100%" height="100%">
              <Box display="none">
                {!isAudioStopped && (
                  <AudioPlayer
                    url={radioProps.url}
                    setRef={(player) => {
                      setIsAudioPlaying(false);
                      setAudioRef(player);
                    }}
                  />
                )}
              </Box>
              <Image alt="img" {...radioProps} />
            </Box>
          )
        }
      </Box>
      <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{ height: '56px', mr: 0.0 }}
          dangerouslySetInnerHTML={{ __html: `
              <lord-icon src="https://cdn.lordicon.com/kvsszuvz.json" trigger="loop" delay="2000" colors="primary:#121331,secondary:#000000" stroke="16" style="width:128px;height:128px;margin-top: -36px;" />
        ` }}
        />
        {title && <b>{title}</b>}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {showVideoButton && (
          <ActionButton color={mode === Modes.VIDEO && activeColor} sx={{ mx: 2 }} onClick={handleVideoButtonClick} tooltip={videoTooltip}>
            <OndemandVideoIcon sx={{ fontSize: '44px' }} />
          </ActionButton>
        )}
        {showAudioButton && (
          <ActionButton color={mode === Modes.AUDIO && activeColor} sx={{ mx: 2 }} onClick={handleRadioButtonClick} tooltip={audioTooltip}>
            {!audioRef && mode === Modes.AUDIO && !isAudioStopped && <CircularProgress />}
            {audioRef && mode === Modes.AUDIO && isAudioPlaying && <PauseIcon sx={{ fontSize: '50px' }} />}
            { (mode !== Modes.AUDIO || ((audioRef && !isAudioPlaying) || isAudioStopped)) && <PlayArrowIcon sx={{ fontSize: '60px' }} />}
          </ActionButton>
        )}
        {showTeamsLink && (
          <ActionButton sx={{ mx: 2 }} onClick={handleTeamsButtonClick} tooltip={teamsTooltip}>
            {teamsIcon && <img alt="teams" src={teamsIcon} width="45" height="45" />}
          </ActionButton>
        )}
      </Box>
    </Box>
  );
};

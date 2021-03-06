/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Container, Dialog, DialogTitle, Grid, IconButton,
  styled,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { FormHandlerContext, PageContext, SiteContext } from '../contexts';
import getLocalizedPath from '../utils/getLocalizedPath';
import { PageRenderer } from '../services';
import ChallengePost from './components/ChallengePost';
import SearchPostSection from './components/SearchPostSection';
import { Video } from '../constants/components/video';

const Avatar = styled('img')(() => ({
  width: '40px',
}));

const POSTS_PER_PAGE = 20;
const StyledImage = styled('img')({});

function NavigationButton({ label, forward, challenge }) {
  const navigate = useNavigate();
  const { site: { language } } = useContext(SiteContext);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => navigate(getLocalizedPath(language, `/${challenge.id}`))}
      >
        {!forward && <StyledImage sx={{ width: '28px', height: 'auto', mt: '5px' }} src="/arrow_left.svg" alt="left" width={10} height={24} />}
        <Box sx={{
          fontSize: { xs: '1.5rem' },
          fontWeight: '400',
          lineHeight: 1.6,
          textTransform: 'none',
          display: 'flex',
          flexDirection: 'column',
          color: 'black',
          alignItems: forward ? 'flex-end' : 'flex-start',
          ...forward ? {
            mr: 1.35,
          } : {
            ml: 1.35,
          },
        }}
        >
          {label}
          <Box component="span" sx={{ fontSize: { xs: '1rem' } }}>{challenge.name}</Box>
        </Box>
        {forward && <StyledImage sx={{ width: '28px', height: 'auto', mt: '5px' }} src="/arrow_right.svg" alt="left" width={10} height={24} />}
      </Button>
    </Box>
  );
}

export default function ChallengePage() {
  const page = useContext(PageContext);
  const challengesStore = page.modules.find((x) => x.moduleType === 'challenges');
  const postTextForm = page.modules.find((x) => x.moduleType === 'facebook-post-text-form');
  const postAudioForm = page.modules.find((x) => x.moduleType === 'facebook-post-audio-form');
  const postPhotoForm = page.modules.find((x) => x.moduleType === 'facebook-post-photo-form');
  const postVideoForm = page.modules.find((x) => x.moduleType === 'facebook-post-video-form');
  const translations = page.modules.find((x) => x.moduleType === 'translations');

  const [selectedMode, setSelectedMode] = useState('list');
  const [posts, setPosts] = useState(null);
  const [postsPage, setPostsPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [filters, setFilters] = useState([]);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState();

  const { id: challengeId } = useParams();

  const { challenges: allChallenges } = challengesStore.moduleVariables;

  const challenges = allChallenges.filter((x) => !x.isDisabled);

  const challengeIdx = challenges.findIndex((x) => x.id.toString() === challengeId);
  const challenge = challenges[challengeIdx];
  const prevChallenge = challenges[challengeIdx - 1];
  const nextChallenge = challenges[challengeIdx + 1];

  if (!challenge) {
    return <h1>Not found</h1>;
  }

  useEffect(() => {
    setPosts(null);
    setPostsPage(-1);
    setSelectedMode('list');
  }, [challengeId]);

  useEffect(() => {
    if (!filters.length) {
      return;
    }

    setPosts([]);
    setPostsPage(-1);
    setSelectedMode('list');
  }, [filters]);

  useEffect(() => {
    (async () => {
      if (postsPage < 0) {
        setPostsPage(0);
        return;
      }

      const { data: { items, total } } = await axios.get('/api/posts', {
        params: {
          challengeId: challenge.id.toString(),
          offset: postsPage * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
          filters: filters.map((x) => x.value).join(','),
        },
      });

      setTotalPosts(total);
      setPosts([...posts || [], ...items]);
    })();
  }, [postsPage]);

  const buttons = [
    challenge.isPostTextEnabled && { text: translations.moduleVariables['Post text'], key: 'text', modules: [postTextForm] },
    challenge.isPostAudioEnabled && { text: translations.moduleVariables['Post audio'], key: 'audio', modules: [postAudioForm] },
    challenge.isPostPhotoEnabled && { text: translations.moduleVariables['Post photo'], key: 'photo', modules: [postPhotoForm] },
    challenge.isPostVideoEnabled && { text: translations.moduleVariables['Post video'], key: 'video', modules: [postVideoForm] },
  ].filter((x) => !!x);

  const selectedButton = buttons.find((x) => x.key === selectedMode);

  const onSubmitMessage = async (item) => {
    await axios.post('/api/posts', {
      challengeId: challenge.id.toString(),
      type: selectedMode,
      data: item,
    });

    setPosts(null);
    setPostsPage(-1);
    setSelectedMode('list');
  };

  const pageRenderer = selectedButton && new PageRenderer({ modules: selectedButton.modules, inline: true });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          background: 'rgb(254, 196, 9)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
          <StyledImage
            src="/tomra_background_5_yellow.svg"
            alt="bg"
            sx={{
              height: '200%',
              transform: { xs: 'translate(0%,30%)', md: 'translate(-40%,30%)', lg: 'translate(-80%,30%)' },
            }}
          />
        </Box>
        <Container maxWidth="lg" sx={{ zIndex: 1, display: 'flex', flexWrap: 'wrap', py: 8, minHeight: { md: '470px' } }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ pr: { xs: 0, md: 3 } }}>
              {challenge.category && (
                <Box sx={{ display: 'flex' }}>
                  {challenge.avatarId
                    ? <Avatar sx={{ width: { xs: '60px', sm: '50px' } }} src={`/api/uploads/w_200/${challenge.avatarId}.png`} />
                    : <Avatar sx={{ width: { xs: '60px', sm: '50px' } }} src="/musical-note.png" /> }
                  <Box sx={{ fontSize: '1.9rem', fontWeight: '500', ml: 2 }}>{challenge.category}</Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <Box sx={{ fontSize: '2.5rem', fontWeight: '500', width: { xs: '100%', md: 'auto' } }}>{challenge.name}</Box>
                <Box sx={{ fontSize: '0.8rem', ml: { xs: 0, md: 6 }, mb: { xs: 0, md: 1.32 }, color: '#4d6376' }}>
                  {totalPosts}
                  {' '}
                  {translations.moduleVariables.participants}
                </Box>
              </Box>
              {challenge.content && (
                <Box sx={{ mt: 1 }}>
                  <div dangerouslySetInnerHTML={{ __html: challenge.content }} />
                </Box>
              )}
              {(challenge.video && challenge.videoThumbnailId) && (
                <Box sx={{ mt: 1, width: '130px', borderRadius: 1.2, overflow: 'hidden', display: 'flex', position: 'relative' }}>
                  <StyledImage
                    src={`/api/uploads/w_500,c_limit/${challenge.videoThumbnailId}`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Box
                    onClick={() => setVideoPreviewUrl(challenge.video)}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover .thumbnail': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      className="thumbnail"
                      sx={{
                        borderRadius: '100%',
                        backgroundColor: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0.7,
                      }}
                    >
                      <PlayArrowIcon htmlColor="white" sx={{ fontSize: '44px' }} />
                    </Box>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {challenge.instruction && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
                  <Box sx={{
                    borderRadius: 1,
                    backgroundColor: 'rgb(223, 19, 73)',
                    height: '100%',
                    width: '100%',
                    maxWidth: { xs: 'auto', md: '500px' },
                    color: 'white',
                    p: 3,
                  }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: challenge.instruction }} />
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ backgroundColor: 'rgba(250, 213, 73, 0.025)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', mt: 2 }}>
            {prevChallenge && (
              <NavigationButton label={translations.moduleVariables.Previous || 'Previous '} challenge={prevChallenge} />
            )}
            <Box sx={{ flexGrow: 1 }} />
            {nextChallenge && (
              <NavigationButton label={translations.moduleVariables.Next || 'Next'} challenge={nextChallenge} forward />
            )}
          </Box>
        </Container>
        <Container maxWidth="md">
          <Grid container sx={{ mt: 2, mb: 4 }} rowSpacing={2}>
            {buttons.map((button) => (
              <Grid item key={button.text} xs={6} sm={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" sx={{ width: '150px' }} onClick={() => setSelectedMode(button.key)}>
                  {button.text}
                </Button>
              </Grid>
            ))}
          </Grid>
          {selectedMode === 'list' ? (
            posts ? (
              <Box sx={{ minHeight: '400px' }}>
                {(totalPosts > 0 || filters.length > 0) && <SearchPostSection onChange={setFilters} />}
                <Box sx={{ my: 5 }}>
                  {posts.map((post) => <ChallengePost key={post.id} post={post} sx={{ mb: 2 }} />)}
                </Box>
                { posts && posts.length < totalPosts && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button onClick={() => setPostsPage(postsPage + 1)}>{translations.moduleVariables['Load more']}</Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ pt: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )
          ) : (
            <Box>
              <FormHandlerContext.Provider value={{ submit: onSubmitMessage }}>
                {pageRenderer.render()}
              </FormHandlerContext.Provider>
            </Box>
          ) }
        </Container>
      </Box>
      {videoPreviewUrl && (
        <Dialog
          open={!!videoPreviewUrl}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
            Video
            <IconButton sx={{ ml: 'auto' }} onClick={() => setVideoPreviewUrl(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Video url={videoPreviewUrl} sx={{ marginBottom: '-1px' }} autoPlay />
        </Dialog>
      )}
    </>
  );
}

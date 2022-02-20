/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Container,
  Grid, IconButton,
  Typography, styled,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FormHandlerContext, PageContext, SiteContext } from '../contexts';
import getLocalizedPath from '../utils/getLocalizedPath';
import { PageRenderer } from '../services';
import ChallengePost from './components/ChallengePost';

const POSTS_PER_PAGE = 3;
const StyledImage = styled('img')({});

function NavigationButton({ label, forward, challenge }) {
  const navigate = useNavigate();
  const { site: { language } } = useContext(SiteContext);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        sx={{
          fontSize: { xs: '1.5rem' },
          fontWeight: '400',
          lineHeight: 1.6,
          textTransform: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: forward ? 'flex-end' : 'flex-start',
        }}
        onClick={() => navigate(getLocalizedPath(language, `/${challenge.id}`))}
      >
        {label}
        <Box component="span" sx={{ fontSize: { xs: '1rem' } }}>{challenge.name}</Box>
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
  const [selectedMode, setSelectedMode] = useState('list');
  const [posts, setPosts] = useState(null);
  const [postsPage, setPostsPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const { id: challengeId } = useParams();

  const { challenges } = challengesStore.moduleVariables;

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
        },
      });

      setTotalPosts(total);
      setPosts([...posts || [], ...items]);
    })();
  }, [postsPage]);

  const buttons = [
    { text: 'Post text', key: 'text', modules: [postTextForm] },
    { text: 'Post audio', key: 'audio', modules: [postAudioForm] },
    { text: 'Post photo', key: 'photo', modules: [postPhotoForm] },
    { text: 'Post video', key: 'video', modules: [postVideoForm] },
  ];

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
        <Container maxWidth="lg" sx={{ zIndex: 1, display: 'flex', flexWrap: 'wrap', py: 8 }}>
          <Grid container>
            <Grid item xs={12} md={6} sx={{ pr: { xs: 0, md: 3 } }}>
              {challenge.category && <Box sx={{ fontSize: '1.9rem', fontWeight: '500' }}>{challenge.category}</Box>}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <Box sx={{ fontSize: '2.5rem', fontWeight: '500', width: { xs: '100%', md: 'auto' } }}>{challenge.name}</Box>
                <Box sx={{ fontSize: '0.8rem', ml: { xs: 0, md: 6 }, mb: { xs: 0, md: 1.32 }, color: '#4d6376' }}>
                  {totalPosts}
                  {' '}
                  participants
                </Box>
              </Box>
              {challenge.content && (
                <Box sx={{ mt: 1 }}>
                  <div dangerouslySetInnerHTML={{ __html: challenge.content }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {challenge.instruction && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
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
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', mt: 2 }}>
            {prevChallenge && (
              <NavigationButton label="Previous" challenge={prevChallenge} />
            )}
            <Box sx={{ flexGrow: 1 }} />
            {nextChallenge && (
              <NavigationButton label="Next" challenge={nextChallenge} forward />
            )}
          </Box>
          <Grid container sx={{ mt: 2 }} rowSpacing={2}>
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
              <>
                <Box sx={{ my: 5 }}>
                  {posts.map((post) => <ChallengePost key={post.id} post={post} sx={{ mb: 2 }} />)}
                </Box>
                { posts && posts.length < totalPosts && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button onClick={() => setPostsPage(postsPage + 1)}>Load more</Button>
                  </Box>
                )}
              </>
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
    </>
  );
}

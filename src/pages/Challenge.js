/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Container,
  Grid, IconButton,
  Typography,
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

export default function ChallengePage() {
  const page = useContext(PageContext);
  const challengesStore = page.modules.find((x) => x.moduleType === 'facebook-challenges');
  const postTextForm = page.modules.find((x) => x.moduleType === 'facebook-post-text-form');
  const postAudioForm = page.modules.find((x) => x.moduleType === 'facebook-post-audio-form');
  const postPhotoForm = page.modules.find((x) => x.moduleType === 'facebook-post-photo-form');
  const postVideoForm = page.modules.find((x) => x.moduleType === 'facebook-post-video-form');
  const [selectedMode, setSelectedMode] = useState('list');
  const [posts, setPosts] = useState(null);
  const [postsPage, setPostsPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const navigate = useNavigate();
  const { id: challengeId } = useParams();
  const { site: { language } } = useContext(SiteContext);

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

  const banner = page.modules.find((x) => x.moduleType === `banner-${challenge.id.toString()}`);

  const pageRenderer = selectedButton && new PageRenderer({ modules: selectedButton.modules, inline: true });

  return (
    <Box sx={{ backgroundColor: 'rgba(250, 213, 73, 0.025)' }}>
      {banner && new PageRenderer({ modules: [banner], inline: true }).render()}
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7, mb: 4 }}>
          <Box
            component="span"
            sx={{
              fontSize: 28,
              fontWeight: '500',
              color: 'white',
              paddingX: 2,
              background: 'var(--primary-color)',
              mixBlendMode: 'multiply',
            }}
          >
            {challenge.name}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: 2 }}>
          {prevChallenge && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate(getLocalizedPath(language, `/${prevChallenge.id}`))} sx={{ mr: { xs: 0, sm: 1 } }}>
                <ArrowBackIcon sx={{ fontSize: { xs: 20, md: 34 } }} />
              </IconButton>
              <Typography sx={{ fontSize: { xs: 19, md: 24 } }}>{prevChallenge.name}</Typography>
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {nextChallenge && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontSize: { xs: 19, md: 24 } }}>{nextChallenge.name}</Typography>
              <IconButton onClick={() => navigate(getLocalizedPath(language, `/${nextChallenge.id}`))} sx={{ ml: { xs: 0, sm: 1 } }}>
                <ArrowForwardIcon sx={{ fontSize: { xs: 20, md: 34 } }} />
              </IconButton>
            </Box>
          )}
        </Box>
        {challenge.description && (
          <Box>
            <div dangerouslySetInnerHTML={{ __html: challenge.content }} />
          </Box>
        )}
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
  );
}
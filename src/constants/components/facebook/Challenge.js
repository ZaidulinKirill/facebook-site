/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, Container,
  Divider, Form, Grid, IconButton,
  List, ListItemAvatar, ListItemButton, ListItemText,
  Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary,
  Typography, styled,
} from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { FormHandlerContext, PageContext, SiteContext } from '../../../contexts';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import FacebookNavbar from './Navbar';
import { TextareaField } from '../form/textareaField';
import { PageRenderer } from '../../../services';
import ChallengePost from './ChallengePost';

const POSTS_PER_PAGE = 10;

export default function FacebookChallenge() {
  const page = useContext(PageContext);
  const challengesStore = page.modules.find((x) => x.moduleType === 'facebook-challenges');
  const postTextForm = page.modules.find((x) => x.moduleType === 'facebook-post-text-form');
  const postAudioForm = page.modules.find((x) => x.moduleType === 'facebook-post-audio-form');
  const postPhotoForm = page.modules.find((x) => x.moduleType === 'facebook-post-photo-form');
  const postVideoForm = page.modules.find((x) => x.moduleType === 'facebook-post-video-form');
  const [selectedMode, setSelectedMode] = useState('list');
  const [posts, setPosts] = useState(null);
  const [postsPage, setPostsPage] = useState(0);
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

      const { data: items } = await axios.get('/api/posts', {
        params: {
          challengeId: challenge.id.toString(),
          offset: postsPage * POSTS_PER_PAGE,
          limit: POSTS_PER_PAGE,
        },
      });

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
    <Box sx={{ }}>
      <FacebookNavbar title={challenge.name} />
      <Container maxWidth="md">
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
            <Box>
              {posts.map((post) => <ChallengePost key={post.id} post={post} />)}
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
  );
}

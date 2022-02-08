/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { memo, useContext, useState } from 'react';
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
import { ValidatorForm } from 'react-material-ui-form-validator';
import fontColorContrast from 'font-color-contrast';
import { FormHandlerContext, PageContext, SiteContext } from '../../../contexts';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import { TextareaField } from '../form/textareaField';
import { PageRenderer } from '../../../services';
import UserAvatar from '../../../components/UserAvatar';

const FormBase = styled(ValidatorForm)({});

function PostContent({ post, sx }) {
  if (post.type === 'video') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
        {post.data.description}
        <Box component="video" src={`/api/uploads/${post.data.video}#t=0.01`} sx={{ mt: 1 }} controls />
      </Box>
    );
  }

  if (post.type === 'photo') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
        {post.data.description}
        <Box sx={{ mt: 1, height: 0, overflow: 'hidden', paddingTop: '50%', position: 'relative' }}>
          <a href={`/api/uploads/${post.data.photo}`} target="_blank" rel="noreferrer">
            <Box
              component="img"
              src={`/api/uploads/w_1500,c_limit/${post.data.photo}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </a>
        </Box>
      </Box>
    );
  }

  if (post.type === 'audio') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
        {post.data.description}
        <Box component="audio" src={`/api/uploads/${post.data.audio}?range=true`} sx={{ mt: 1, width: '100%' }} controls />
      </Box>
    );
  }

  if (post.type === 'text') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
        {post.data.description}
        <Box sx={{ mt: 1, height: 0, overflow: 'hidden', paddingTop: '35%', position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: post.data.background,
              textAlign: 'center',
              ...post.data.background && {
                color: fontColorContrast(post.data.background),
              },
              fontSize: { xs: 20, sm: 40 },
              overflow: 'hidden',
            }}
          >
            {post.data.description}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {post.data.description}
      {JSON.stringify(post)}
    </Box>
  );
}

const MemoizedPostContent = memo(PostContent);

export default function ChallengePost({ post, sx }) {
  const userName = `${post.user.name || ''} ${post.user.lastName || ''}`.trim();
  const time = `${new Date(post.created_at).toLocaleDateString()} ${new Date(post.created_at).toLocaleTimeString()}`;

  return (
    <Box sx={sx}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <UserAvatar user={post.user} sx={{ mr: 2, width: 48, height: 48 }} />
        <Box>
          <Box sx={{ fontWeight: '500' }}>
            {userName}
          </Box>
          <Box sx={{ fontSize: 'smaller' }}>
            {time}
          </Box>
        </Box>
      </Box>
      <MemoizedPostContent sx={{ mt: 1 }} post={post} />
    </Box>
  );
}

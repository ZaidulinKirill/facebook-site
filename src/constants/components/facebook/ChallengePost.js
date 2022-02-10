/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { memo, useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, IconButton, TextField,
} from '@mui/material';
import fontColorContrast from 'font-color-contrast';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import moment from 'moment';
import UserAvatar from '../../../components/UserAvatar';
import { LikeButton } from './LikeButton';
import { LikesArea } from './LikesArea';

const getUserName = (user) => `${user.name || ''} ${user.lastName || ''}`.trim();

function PostContent({ post, sx }) {
  if (post.type === 'video') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
        {post.data.description}
        <Box component="video" src={`/api/uploads/${post.data.video}#t=1`} sx={{ mt: 1 }} controls preload />
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

function SendMessageSection({ replyTo, onClear, post, onSent }) {
  const [message, setMessage] = useState('');

  async function sendMessage(e) {
    e.preventDefault();
    e.stopPropagation();

    await axios.post('/api/posts/message', {
      text: `${replyTo ? `@${getUserName(replyTo.user)}, ` : ''}${message}`,
      postId: post.id,
      ...replyTo && { replyMessageId: replyTo.id },
    });

    setMessage('');
    onClear();

    if (onSent) {
      onSent();
    }
  }

  return (
    <form onSubmit={sendMessage}>
      <Box sx={{ display: 'flex', alignItems: 'center' }} id={`message-field-${post.id}`}>
        <TextField
          sx={{ flexGrow: 1 }}
          label="Post comment"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            startAdornment: replyTo && (
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' }, mr: 1, whiteSpace: 'pre' }}>
                @
                {getUserName(replyTo.user)}
              </Box>
            ),
            endAdornment: message.length > 0 && (
              <IconButton onClick={() => { setMessage(''); onClear(); }}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        <IconButton sx={{ flexShrink: 0, ml: 1 }} color="primary" size="large" disabled={!message?.length} type="submit">
          <SendIcon />
        </IconButton>
      </Box>
    </form>
  );
}

function ChallengePostMessage({ message, sx, onReply }) {
  const [refreshLikesTrigger, setRefreshLikesTrigger] = useState(false);

  const userName = getUserName(message.user);
  const time = moment(message.created_at).fromNow();

  return (
    <Box sx={{ maxWidth: '600px', ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <UserAvatar user={message.user} sx={{ mr: 2, width: 48, height: 48 }} />
        <Box sx={{ fontSize: '14px', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ fontWeight: '500' }}>
              {userName}
            </Box>
            <Box component="span" sx={{ ml: 'auto', fontSize: 'smaller', display: { xs: 'none', sm: 'inline' } }}>
              {time}
            </Box>
          </Box>
          {!message.replyMessageId ? (
            <Box>
              {message.text}
            </Box>
          ) : (
            <Box>
              <Box
                component="span"
                sx={{ color: 'blue' }}
              >
                {message.text.match(/^@[^,]*, /)[0]}
              </Box>
              {message.text.replace(/^@[^,]*, /, '')}
            </Box>
          )}
          <Box sx={{ display: 'flex', paddingBottom: '3px', borderBottom: 'thin solid rgb(220, 225, 230)' }}>
            <Box
              component="a"
              size="small"
              sx={{ cursor: 'pointer', color: 'rgb(42, 88, 133)', '&:hover': { textDecoration: 'underline' } }}
              onClick={onReply}
            >
              Reply
            </Box>
            <LikesArea sx={{ ml: 'auto' }} where={{ messageId: message.id }} refresh={refreshLikesTrigger} onRefreshed={() => setRefreshLikesTrigger(false)} />
            <LikeButton sx={{ ml: 2 }} likeProps={{ messageId: message.id }} onCreated={() => setRefreshLikesTrigger(true)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const MemoizedPostContent = memo(PostContent);
const MESSAGES_PER_PAGE = 5;

export default function ChallengePost({ post, sx }) {
  const [messages, setMessages] = useState(null);
  const [messagesPage, setMessagesPage] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [totalMessages, setTotalMessages] = useState(0);

  const userName = getUserName(post.user);
  const time = `${new Date(post.created_at).toLocaleDateString()} ${new Date(post.created_at).toLocaleTimeString()}`;

  useEffect(() => {
    (async () => {
      if (messagesPage < 0) {
        setMessagesPage(0);
        return;
      }

      const { data: { items, total } } = await axios.get('/api/posts/messages', {
        params: {
          postId: post.id.toString(),
          offset: messagesPage * MESSAGES_PER_PAGE,
          limit: MESSAGES_PER_PAGE,
        },
      });

      setTotalMessages(total);
      setMessages([...messages || [], ...items]);
    })();
  }, [messagesPage]);

  function refetchMessages() {
    setMessages(null);
    setMessagesPage(-1);
  }

  function onReply(message) {
    setReplyTo(message);
    document.querySelector(`#message-field-${post.id}`).scrollIntoView({ block: 'nearest' });
  }

  return (
    <Box sx={{
      ...sx,
      p: 3,
      border: 'thin solid #80808055',
      borderRadius: 2,
      backgroundColor: 'white',
    }}
    >
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
      {/* {!!messages?.length && <Box sx={{ borderTop: 'thin solid #80808055' }} />} */}
      <Box sx={{ mt: 3, pl: { xs: 0, sm: 3 } }}>
        {messages ? (
          <Box sx={{ my: 0 }}>
            {messages.map((message) => <ChallengePostMessage key={message.id} message={message} sx={{ mb: 3 }} onReply={() => onReply(message)} />)}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      { messages && messages.length < totalMessages && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button onClick={() => setMessagesPage(messagesPage + 1)}>Load more</Button>
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <SendMessageSection post={post} onSent={refetchMessages} replyTo={replyTo} onClear={() => { setReplyTo(null); }} />
      </Box>
    </Box>
  );
}

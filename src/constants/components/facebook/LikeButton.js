import React, { useState } from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { Likes, LikesContent } from '../../likes';

export function LikeButton({ likeProps = {}, onCreated }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const likes = Object.values(Likes).map((id) => ({
    id,
    content: LikesContent[id],
  }));

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function createLike(id) {
    await axios.post('/api/posts/like', {
      type: id,
      ...likeProps,
    });

    if (onCreated) {
      onCreated();
    }

    handleClose();
  }

  return (
    <>
      <Box
        component="a"
        size="small"
        sx={{
          cursor: 'pointer',
          color: 'rgb(42, 88, 133)',
          '&:hover': { textDecoration: 'underline' },
        }}
        onClick={openMenu}
      >
        Like
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        disableScrollLock
        autoFocus={false}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            background: 'rgb(13, 30, 52)',
            paddingTop: '0 !important',
            paddingBottom: 0,
          },
          '& .MuiList-root': {
            paddingY: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          },
          '& .MuiMenuItem-root': {
            transition: 'all 0.3s',
          },
          '& .MuiMenuItem-root:hover': {
            transform: 'scale(1.2)',
          },
        }}
      >
        {likes.map((x) => (
          <MenuItem
            onClick={() => createLike(x.id)}
            key={x.id}
            sx={{ paddingX: 1 }}
          >
            {x.content}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

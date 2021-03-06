import { Avatar } from '@mui/material';
import React from 'react';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const defaultStyle = { width: 48, height: 48, backgroundColor: 'white' };

export default function UserAvatar({ user, sx, src }) {
  if (src) {
    return <Avatar src={src} sx={[defaultStyle, sx]} />;
  }

  if (user.avatarId) {
    return <Avatar src={`/api/uploads/w_100/${user.avatarId}.png`} sx={[defaultStyle, sx]} />;
  }

  const { sx: avatarSx, ...props } = stringAvatar(`${user.name} ${user.lastName} `.trim());
  return <Avatar {...props} sx={[defaultStyle, { ...sx, ...avatarSx }]} />;
}

import React from 'react';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const Icons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
};

export const Icon = ({ type, ...props }) => {
  if (!type) {
    return null;
  }

  const Component = Icons[type];

  return (
    <Component {...props} />
  );
};

import React, { useContext } from 'react';
import { Link as LinkBase } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SiteContext } from '../../contexts';

export const Link = ({ underline = 'hover', ...props }) => {
  const { site: { language } } = useContext(SiteContext);

  if (!props.to) {
    return null;
  }

  return props.to.startsWith('/')
    ? <LinkBase component={RouterLink} underline={underline} {...props} to={`${language.implicit ? '' : `/${language.code.toLowerCase()}`}${props.to}`} />
    : <LinkBase component="a" {...props} underline={underline} href={props.to} />;
};

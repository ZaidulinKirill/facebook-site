/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-danger */
import React, { useContext, useState } from 'react';
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
import { FormHandlerContext, PageContext, SiteContext } from '../../../contexts';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import { TextareaField } from '../form/textareaField';
import { PageRenderer } from '../../../services';

const FormBase = styled(ValidatorForm)({});

export default function ChallengePost({ post }) {
  return (
    <Box>
      {JSON.stringify(post)}
    </Box>
  );
}

import React, { useContext } from 'react';
import {
  Box, Container, Grid, styled,
} from '@mui/material';
import Head from 'react-helmet';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  AudioRecorder, CheckboxField, ColorField, Form, BackButton as FormBackButton, FormBlockOfText, NumberField, RadioField,
  SelectField,
  SongSelectField,
  SongsTopField,
  SubmitButton,
  TextField,
  TextareaField,
  UploadButton,
} from './form';
import { Link } from './link';
import { FormContext } from '../../contexts';
import { Html } from './html';
import { Video } from './video';
import LanguageSelector from './languageSelector';
import { Countdown } from './countdown';
import { Icon } from './icon';
import Carousel from './carousel';
import Lightbox from './lightbox';
import EventEmitter from './eventEmitter';
import Drawer from './drawer';
import { Media } from './media';
import { ThemeProvider } from './themeProvider';
import { Banner } from './banner';
import { PasswordProtection } from './passwordProtection';
import { CookieConsent } from './cookieConsent';
import { SiteUnderConstruction } from './siteUnderConstruction';
import AudioPlayer from './audioPlayer';
import { TomraBanner } from './tomra/banner';
import { TomraFooter } from './tomra/footer';
import { BackButton } from './backButton';
import { TomraText } from './tomra/text';

const SpanBase = styled('span')({});
const Image = styled('img')({});
const LazyImage = styled(LazyLoadImage)({});

const Span = ({ children, ...props }) => <SpanBase {...props} dangerouslySetInnerHTML={{ __html: children }} />;

const withFormValue = (Component) => (props) => {
  const { item, setField } = useContext(FormContext);

  const onChange = (event) => {
    setField(props.name, event.target.value);
  };

  const value = item[props.name];
  return <Component {...props} value={value} onChange={onChange} />;
};

export const Components = {
  head: { Component: Head },
  title: { Component: 'title' },
  style: { Component: 'style' },
  'head-link': { Component: 'link' },
  div: { Component: Box },
  theme: { Component: ThemeProvider },
  banner: { Component: Banner },
  span: { Component: Span },
  image: { Component: Image },
  'lazy-image': { Component: LazyImage },
  container: { Component: Container },
  grid: { Component: Grid },
  form: { Component: Form, context: true },
  link: { Component: Link },
  html: { Component: Html },
  video: { Component: Video },
  countdown: { Component: Countdown },
  carousel: { Component: Carousel },
  lightbox: { Component: Lightbox },
  'event-emitter': { Component: EventEmitter },
  icon: { Component: Icon },
  drawer: { Component: Drawer },
  media: { Component: Media },
  'back-button': { Component: BackButton },
  'tomra-banner': { Component: TomraBanner },
  'tomra-footer': { Component: TomraFooter },
  'tomra-text': { Component: TomraText },
  'audio-player': { Component: AudioPlayer },
  'cookie-consent': { Component: CookieConsent },
  'password-protection': { Component: PasswordProtection },
  'site-under-construction': { Component: SiteUnderConstruction },
  'language-selector': { Component: LanguageSelector },
  'form-input-field': { Component: withFormValue(TextField), defaultFieldValue: '' },
  'form-select-field': { Component: withFormValue(SelectField) },
  'form-song-selection': { Component: withFormValue(SongSelectField) },
  'form-songs-top': { Component: withFormValue(SongsTopField) },
  'form-number-field': { Component: withFormValue(NumberField), defaultFieldValue: 0 },
  'form-textarea-field': { Component: withFormValue(TextareaField), defaultFieldValue: '' },
  'form-checkbox-field': { Component: withFormValue(CheckboxField), defaultFieldValue: false },
  'form-radio-field': { Component: withFormValue(RadioField) },
  'form-audio-recorder': { Component: withFormValue(AudioRecorder) },
  'form-file-upload': { Component: withFormValue(UploadButton) },
  'form-color': { Component: withFormValue(ColorField) },
  'form-block-of-text': { Component: FormBlockOfText },
  'form-submit-button': { Component: SubmitButton },
  'form-back-button': { Component: FormBackButton },
  'form-spacing': { Component: 'void' },
};

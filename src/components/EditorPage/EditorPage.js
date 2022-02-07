import React from 'react';
import ContentPage from '../ContentPage';
import { components } from './components';
import { templateVariables } from './templateVariables';
import { pageVariables } from './pageVariables';
import { theme } from './theme';
import { css } from './globalStyles';

export default function EditorPage() {
  return (
    <ContentPage page={{
      templateComponents: components,
      templateVariables,
      pageVariables,
      templateDefaultVariables: pageVariables,
      theme,
      templateCss: css,
    }}
    />
  );
}

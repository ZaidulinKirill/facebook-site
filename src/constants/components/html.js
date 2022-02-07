import React from 'react';
import InnerHTML from 'dangerously-set-html-content';

export const Html = ({ $el, ...props }) => (
  props.children ? <InnerHTML html={props.children} /> : null
);

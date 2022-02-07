const enumerateBreakpoints = (breakpoint) => {
  if (breakpoint === 'md') {
    return ['md', 'sm', 'xs'];
  }

  if (breakpoint === 'sm') {
    return ['sm', 'xs'];
  }

  if (breakpoint === 'xs') {
    return ['xs'];
  }
};

export function getBreakpointValue(item, breakpoint) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const breakpoints = enumerateBreakpoints(breakpoint);

  return breakpoints.map((x) => item[x]).filter((x) => !!x)[0];
}

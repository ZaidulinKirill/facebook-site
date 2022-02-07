export default function getLocalizedPath(language, path) {
  return `${language.implicit ? '' : `/${language.code.toLowerCase()}`}${path}`;
}

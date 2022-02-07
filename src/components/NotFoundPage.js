import React, { useContext } from 'react';
import { PageContext, SiteContext } from '../contexts';
import { PageRenderer } from '../services';

export default function NotFoundPage() {
  const { site } = useContext(SiteContext);

  const page = site.pages.find((x) => x.type === '404');
  if (!page) {
    return (
      <h1>Page not found</h1>
    );
  }

  const pageRenderer = new PageRenderer({
    components: page.templateComponents,
    templateVariables: page.templateVariables.reduce((acc, { name, ...item }) => {
      acc[name] = item;
      return acc;
    }, {}),
    templateDefaultVariables: page.templateDefaultVariables,
    pageVariables: page.pageVariables,
    theme: page.theme,
  });

  return (
    <PageContext.Provider value={page}>
      {pageRenderer.render(page.components)}
    </PageContext.Provider>
  );
}

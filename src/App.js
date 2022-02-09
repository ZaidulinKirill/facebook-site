import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import {
  ContentPage, ErrorPage, NotFoundPage, PageLoading,
} from './components';
import { SiteContext } from './contexts';
import 'intersection-observer';

export default function App() {
  const { site, isSiteLoading, siteLoadingError } = useContext(SiteContext);

  if (isSiteLoading) {
    return <PageLoading />;
  }

  if (siteLoadingError) {
    return <ErrorPage error={siteLoadingError.message} />;
  }

  return (
    <div className="root-container">
      <Router>
        <div className="page-container">
          <Routes>
            {!!site.pages.length && (
              <Route
                caseSensitive={false}
                path={`${site.language.implicit ? '' : `/${site.language.code}`}/*`}
                key={site.pages[0].id}
                element={<ContentPage page={site.pages[0]} />}
              />
            )}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

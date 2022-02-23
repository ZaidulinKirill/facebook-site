import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorPage, NotFoundPage, PageLoading } from './components';
import { SiteContext } from './contexts';
import 'intersection-observer';
import { RootNavigation } from './pages';
import ScrollToTop from './pages/components/ScrollToTop';
import Placeholder from './pages/components/Placeholder';

export default function App() {
  const { site, isSiteLoading, siteLoadingError, isSitePlaceholderEnabled } = useContext(SiteContext);

  if (isSiteLoading) {
    return <PageLoading />;
  }

  if (siteLoadingError) {
    return <ErrorPage error={siteLoadingError.message} />;
  }

  return (
    <div className="root-container">
      <Router>
        <ScrollToTop />
        <div className="page-container">
          <Routes>
            {!isSitePlaceholderEnabled ? (
              <>
                <Route
                  caseSensitive={false}
                  path={`${site.language.implicit ? '' : `/${site.language.code}`}/*`}
                  key={site.pages[0].id}
                  element={<RootNavigation page={site.pages[0]} />}
                />
                <Route
                  path="*"
                  element={<NotFoundPage />}
                />
              </>
            ) : (
              <Route
                path="*"
                element={<Placeholder />}
              />
            )}
          </Routes>
        </div>
      </Router>
    </div>
  );
}

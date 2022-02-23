import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

const { REACT_APP_API_URL } = process.env;

export const SiteContext = createContext({});

export function SiteProvider({ children }) {
  const [isSiteLoading, setIsLoading] = useState(true);
  const [siteLoadingError, setSiteLoadingError] = useState(null);
  const [site, setSite] = useState(null);
  const [isSitePlaceholderEnabled, setIsSitePlaceholderEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let userId = localStorage.getItem('u_id');
        if (!userId) {
          userId = uuid();
          localStorage.setItem('u_id', userId);
        }

        const response = await fetch(`${REACT_APP_API_URL}/site?url=${encodeURIComponent(window.location.href)}&user=${userId}`);
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setSite({ ...data, userId });
        setIsSitePlaceholderEnabled(data.pages.find((x) => x.modules.find((x) => x.systemType === 'siteUnderConstruction')));

        fetch(`${REACT_APP_API_URL}/stats/client`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            siteId: data.id,
            languageId: data.language.id,
          }),
        });
      } catch (err) {
        setSiteLoadingError(err);
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <SiteContext.Provider value={{ site, isSiteLoading, siteLoadingError, isSitePlaceholderEnabled }}>
      {children}
    </SiteContext.Provider>
  );
}

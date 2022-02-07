import React, { useCallback, useContext, useState } from 'react';
import FsLightbox from 'fslightbox-react';
import { EventContext } from '../../contexts';

export default function Lightbox({ sources = [], sourceKey, children, ...props }) {
  const [toggler, setToggler] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(1);
  const eventContext = useContext(EventContext);

  const urls = sources.map((source) => (sourceKey ? source[sourceKey] : source)).map((x) => `/api/uploads/${x}`);
  console.log({ sources, sourceKey, urls });
  const emit = useCallback((event, eventArgs) => {
    if (event === 'lightbox:open') {
      const index = urls.findIndex((x) => x === eventArgs[0]);
      setSelectedSlide(index === -1 ? 1 : index + 1);
      setToggler(true);

      return;
    }

    if (eventContext && eventContext.emit) {
      eventContext.emit(event, eventArgs);
    }
  }, [eventContext]);

  return (
    <>
      {sources && sources.length && eventContext && (
        <FsLightbox
          toggler={toggler}
          onClose={() => setToggler(false)}
          {...props}
          sources={urls}
          slide={selectedSlide}
        />
      )}
      <EventContext.Provider value={{ emit }}>
        {children}
      </EventContext.Provider>
    </>
  );
}

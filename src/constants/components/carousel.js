import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Box, IconButton } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowBackIos';
import ArrowRightIcon from '@mui/icons-material/ArrowForwardIos';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-video.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgVideo from 'lightgallery/plugins/video';
import { useRecursiveTimeout } from '../../hooks';

export default function Carousel({
  id, autoplayInterval = -1, video, playButton, lightbox, columns, images, spacing, sx, children: [{ props: { children } }], ...props
}) {
  const filteredChildren = children.filter((x) => !!x);

  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false, startIndex: Math.floor(filteredChildren.length / 2), ...props });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  const autoplay = useCallback(() => {
    if (!embla) return;
    if (embla.canScrollNext()) {
      embla.scrollNext();
    } else {
      embla.scrollTo(0);
    }
  }, [embla]);

  const { play, stop } = useRecursiveTimeout(autoplay, autoplayInterval);

  const scrollNext = useCallback(() => {
    if (!embla) return;
    embla.scrollNext();
  }, [embla, stop]);

  const scrollPrev = useCallback(() => {
    if (!embla) return;
    embla.scrollPrev();
  }, [embla, stop]);

  useEffect(() => {
    if (!embla) return;

    onSelect();
    embla.on('select', onSelect);
    embla.on('pointerDown', stop);
    embla.on('pointerUp', play);
  }, [embla, onSelect]);

  useEffect(() => {
    play();
  }, [play]);

  if (!filteredChildren.length) {
    return null;
  }

  const randomId = new Date().valueOf();
  return (
    <Box id={id} className="embla" sx={{ position: 'relative', ...sx }}>
      <LightGallery
        speed={500}
        plugins={[...!video ? [lgThumbnail] : [], lgVideo]}
        selector={`.lightbox-${randomId}-image`}
        exThumbImage="data-thumb"
        {...lightbox}
      >
        <Box
          className="embla__viewport"
          sx={{
            overflow: 'hidden',
            width: '100%',
            '& .is-draggable': {
              cursor: 'grab',
            },
            '& .is-dragging': {
              cursor: 'grabbing',
            },
          }}
          ref={viewportRef}
        >
          <Box
            className="embla__container"
            sx={{
              display: 'grid',
              gridAutoColumns: columns,
              columnGap: spacing,
              gridAutoFlow: 'column',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              KhtmlUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {children.map((child, idx) => (
              <Box
                key={child.key}
                className="embla__slide"
                sx={{
                  position: 'relative',
                  minWidth: '50%',
                }}
              >
                {video ? (
                  <>
                    <Box sx={{ pointerEvents: 'none' }}>
                      { child }
                    </Box>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconButton className={`lightbox-${randomId}-image`} data-src={images[idx].video} sx={playButton}>
                        <PlayCircleOutlineIcon htmlColor="white" sx={{ fontSize: 60 }} />
                        <Box sx={{ display: 'none' }}>{ child }</Box>
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <a
                    className={`lightbox-${randomId}-image`}
                    data-src={`/api/uploads/w_2000,c_limit/${images[idx].image}`}
                    data-thumb={`/api/uploads/w_200,c_limit/${images[idx].image}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {child}
                  </a>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </LightGallery>
      {prevBtnEnabled && (
        <IconButton
          sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer' }}
          onClick={scrollPrev}
        >
          <ArrowLeftIcon sx={{ fontSize: 38, color: 'white', filter: 'drop-shadow( 0px 0px 1px rgba(0, 0, 0, .9))' }} />
        </IconButton>
      )}
      {nextBtnEnabled && (
        <IconButton
          sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translate(0, -50%)', cursor: 'pointer' }}
          onClick={scrollNext}
        >
          <ArrowRightIcon sx={{ fontSize: 38, color: 'white', filter: 'drop-shadow( 0px 0px 1px rgba(0, 0, 0, .9))' }} />
        </IconButton>
      )}
    </Box>
  );
}

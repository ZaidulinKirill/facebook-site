export const components = [
  {
    type: 'head',
    content: [
      { type: 'title', content: '{{Meta title}}' },
      { type: 'style', content: '{{Global styles}}' },
    ],
  },
  {
    type: 'div',
    content: [
      {
        type: 'div',
        style: {
          height: { xs: 50, md: 64 },
          color: 'var(--primary-text-color)',
          zIndex: 1000,
          backgroundColor: 'var(--primary-color)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          width: '100%',
          top: 0,
          fontFamily: 'Oswald, sans-serif',
        },
        content: [
          {
            type: 'drawer',
            props: { width: '250px' },
            style: { position: 'absolute', left: 10 },
            content: [{
              type: 'div',
              style: { display: 'flex', flexDirection: 'column', pt: 8, pl: 1, backgroundColor: 'black', flexGrow: 1 },
              content: [
                {
                  type: 'array',
                  ref: 'Menu items',
                  content: [
                    {
                      type: 'link',
                      props: { to: '[[href]]' },
                      style: { color: 'white', fontSize: '18px', m: { xs: 1 }, textTransform: 'uppercase' },
                      content: '[[text]]',
                    },
                  ],
                },
              ],
            }],
          },
          {
            type: 'array',
            ref: 'Menu items',
            content: [
              {
                type: 'link',
                props: { to: '[[href]]' },
                style: { display: { xs: 'none', md: 'block' }, color: 'var(--primary-text-color)', fontSize: '15px', mx: { xs: 1, sm: 3 }, textTransform: 'uppercase', '&:hover': { color: 'gray', textDecoration: 'none' } },
                content: '[[text]]',
              },
            ],
          },
          {
            type: 'div',
            style: { flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', height: '100%' },
            content: [{
              type: 'image',
              style: { height: '100%', paddingY: 1 },
              props: { src: 'https://static.wixstatic.com/media/d0d063_a387158bfccd462e8a169de17d39c104~mv2.png/v1/fill/w_806,h_350,al_c,q_85,usm_0.66_1.00_0.01/Radio%20Agristo.webp' },
            }],
          },
          { type: 'language-selector', props: { color: 'inherit' }, style: { position: 'absolute', fontWeight: 'bold', right: { xs: 0, sm: 10 } } },
        ],
      },
      {
        type: 'div',
        props: {
          id: 'home',
        },
        style: {
          mt: '48px',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundSize: 'cover',
          justifyContent: 'center',
          backgroundImage: 'url(https://static.wixstatic.com/media/d0d063_fcf234d4cfd2412488d7d4cfd2fc9052~mv2.jpg/v1/fill/w_640,h_514,al_b,q_80,usm_0.66_1.00_0.01/d0d063_fcf234d4cfd2412488d7d4cfd2fc9052~mv2.webp)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 50%',
        },
        content: [
          {
            type: 'span',
            style: {
              fontSize: {
                lg: '6rem',
                md: '4rem',
                xs: '2rem',
              },
              color: '{{Banner text color}}',
            },
            content: '{{Banner text}}',
          },
        ],
      },
      {
        type: 'container',
        props: {
          maxWidth: 'md',
        },
        style: { pt: 10 },
        content: [
          {
            type: 'div',
            style: { display: 'flex', alignItems: 'center', flexDirection: 'column' },
            content: [
              { type: 'video', props: { url: 'https://player.vimeo.com/video/640309265?h=800030d4bb&amp;title=0&amp;muted=1&amp;autoplay=1&amp;app_id=122963' } },
              {
                type: 'div',
                style: { mt: 7, fontSize: { lg: '2rem', md: '1.5rem', xs: '0.8rem' }, fontWeight: 'bold', backgroundColor: 'var(--primary-color)', color: 'var(--primary-text-color)', px: 2 },
                content: [
                  { type: 'span', content: 'Herbeluister de volledig radioshow' },
                ],
              },
              {
                type: 'div',
                style: { mt: 3, fontSize: { lg: '1.3rem', md: '1rem' }, textAlign: 'center' },
                content: [
                  { type: 'span', content: 'We hebben de show opgeknipt in blokken van telkens 1 uur.<br> Beluister Radio Agristo - part 1 om niets te missen.', textAlign: 'center' },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'carousel',
        props: {
          columns: { xs: '100%', md: '25%' },
          spacing: { xs: 10, md: 5 },
          startIndex: 3,
        },
        style: { mt: 10, px: 2 },
        content: [{
          type: 'array',
          ref: 'Video carousel items',
          content: [{
            type: 'div',
            content: [{
              type: 'video',
              props: { url: '[[video]]', controls: true },
            },
            { type: 'div', content: '[[name]]', style: { color: 'var(--primary-color)', pt: 1.4, fontWeight: 'bold' } }],
          }],
        }],
      },
      {
        type: 'div',
        style: { mt: 14, backgroundColor: 'var(--primary-color)', color: 'var(--primary-text-color)', py: 8, display: { xs: 'none', md: 'block' } },
        props: { id: 'listen' },
        content: [
          { type: 'div', style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: { lg: '48px', md: '1.3rem', xs: '1rem' } }, content: 'RADIO AGRISTO BY THE NUMBERS' },
          {
            type: 'container',
            props: { maxWidth: 'lg' },
            style: {
              mt: 4,
              display: 'flex',
              justifyContent: 'space-around',
              '& > div': {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              },
              '& .count': {
                fontSize: '110px',
                pr: 3,
                lineHeight: '1.25',
                borderRight: 'thin solid var(--primary-text-color)',
              },
              '& > div .text': {
                width: '30px',
                height: '100%',
              },
              '& > div .text span': {
                transform: 'rotate(90deg)',
                marginLeft: 1.5,
                fontSize: '24px',
                whiteSpace: 'pre',
                display: 'block',
                marginTop: '10px',
              },
            },
            content: [
              {
                type: 'div',
                content: [
                  { type: 'span', props: { className: 'count' }, content: '8' },
                  { type: 'div', props: { className: 'text' }, content: [{ type: 'span', content: 'Live hours' }] },
                ],
              },
              {
                type: 'div',
                content: [
                  { type: 'span', props: { className: 'count' }, content: '790' },
                  { type: 'div', props: { className: 'text' }, content: [{ type: 'span', content: 'Listeners' }] },
                ],
              },
              {
                type: 'div',
                content: [
                  { type: 'span', props: { className: 'count' }, content: '810' },
                  { type: 'div', props: { className: 'text' }, content: [{ type: 'span', content: 'Viewers' }] },
                ],
              },
              {
                type: 'div',
                content: [
                  { type: 'span', props: { className: 'count' }, content: '237' },
                  { type: 'div', props: { className: 'text' }, content: [{ type: 'span', content: 'Messages' }] },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'container',
        props: {
          id: 'top-35',
          maxWidth: 'md',
        },
        style: { pt: 10 },
        content: [
          {
            type: 'div',
            style: { display: 'flex', alignItems: 'center', flexDirection: 'column' },
            content: [
              {
                type: 'div',
                style: { mt: 0, fontSize: { lg: '2rem', md: '1.5rem', xs: '0.8rem' }, fontWeight: 'bold', backgroundColor: 'var(--primary-color)', color: 'var(--primary-text-color)', px: 2 },
                content: [
                  { type: 'span', content: 'Check out our spotify playlist' },
                ],
              },
              {
                type: 'div',
                style: { mt: 3, fontSize: { lg: '1.5rem', md: '1rem' }, fontWeight: 'bold', textAlign: 'center' },
                content: [
                  { type: 'span', content: 'Sing along with our top-of-35', textAlign: 'center' },
                ],
              },
              {
                type: 'div',
                style: {
                  mt: 3,
                  '& iframe': {
                    width: '100%',
                    maxWidth: '400px',
                    height: '80px',
                  },
                },
                content: [
                  { type: 'html', content: '{{Top 35 snippet}}' },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'div',
        style: { pt: 3 },
        props: { id: 'video-list' },
        content: [
          {
            type: 'lightbox',
            props: { sources: '{{Image carousel items}}', sourceKey: 'url' },
            content: [{
              type: 'carousel',
              props: {
                columns: { xs: 'calc(100%)', md: 'calc(100% / 3 - 30px)', lg: 'calc(100% / 5 - 30px)' },
                spacing: { xs: '10px', md: '30px' },
                startIndex: 2,
              },
              style: { mt: 10, px: 2 },
              content: [
                {
                  type: 'array',
                  ref: 'Image carousel items',
                  content: [
                    {
                      type: 'event-emitter',
                      props: { event: 'click', eventName: 'lightbox:open', eventArgs: ['[[video]]'] },
                      content: [{
                        type: 'div',
                        style: { width: '100%', position: 'relative', paddingBottom: '100%' },
                        content: [{
                          type: 'image',
                          style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
                          props: { src: '[[url]]' },
                        }],
                      }],
                    },
                  ],
                },
              ],
            }],
          },
        ],
      },
      {
        type: 'div',
        style: { mt: 20, backgroundColor: 'var(--primary-color)', color: 'var(--primary-text-color)', pt: 8, pb: 2 },
        content: [
          { type: 'div', style: { textAlign: 'center', mb: 4, letterSpacing: '0.5em', fontSize: { lg: '48px', md: '1.3rem', xs: '1rem' } }, content: 'FOOTER' },
          {
            type: 'div',
            style: { display: 'flex', justifyContent: 'flex-end', px: 4 },
            content: [
              { type: 'link', style: { mr: 2 }, props: { to: '{{Facebook link}}', target: '_blank' }, content: [{ type: 'icon', props: { type: 'facebook' }, style: { fontSize: '32px', color: 'var(--primary-text-color)' } }] },
              { type: 'link', style: { mr: 2 }, props: { to: '{{Instagram link}}', target: '_blank' }, content: [{ type: 'icon', props: { type: 'instagram' }, style: { fontSize: '32px', color: 'var(--primary-text-color)' } }] },
            ],
          },
        ],
      },
    ],
  },
];

/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, CircularProgress, Container, Divider,
  List, ListItemAvatar, ListItemButton,
  ListItemText, Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary,
  Typography, styled,
} from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { PageContext, SiteContext } from '../contexts';
import getLocalizedPath from '../utils/getLocalizedPath';
import { MainText } from './components/MainText';

const StyledImage = styled('img')({});

const Avatar = styled('img')(() => ({
  width: '40px',
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: null,
  '&:not(:last-child)': {
    borderBottom: 0,
    borderTop: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.8rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  border: 'none',
  backgroundColor: 'rgb(251, 219, 229)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgb(251, 219, 229)',
  borderTop: 'nono',
}));

export default function MainPage() {
  const page = useContext(PageContext);
  const challengesStore = page.modules.find((x) => x.moduleType === 'challenges');
  const translations = page.modules.find((x) => x.moduleType === 'translations');
  const [selectedSection, setSelectedSection] = useState(challengesStore.moduleVariables.sections[0].id);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const navigate = useNavigate();
  const { site: { language } } = useContext(SiteContext);

  const { challenges } = challengesStore.moduleVariables;

  useEffect(() => {
    (async () => {
      const { data: { items } } = await axios.post('/api/posts/challenges', {
        ids: challenges.map((x) => x.id.toString()),
      });

      setAdditionalInfo(items);
    })();
  }, []);

  if (!additionalInfo) {
    return (
      <Box sx={{ pt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const sections = challengesStore.moduleVariables.sections.map((section) => ({
    ...section,
    challenges: challenges.filter((x) => x.section === section.key).map((x) => ({ ...x, entries: additionalInfo[x.id.toString()]?.count })),
  }));

  return (
    <Box>
      <MainText />
      <Box sx={{ pt: 7, pb: 10, backgroundColor: 'rgb(248, 163, 188)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
        >
          <StyledImage
            src="/tomra_background_0_pink.svg"
            alt="bg"
            sx={{
              height: '300%',
              transform: 'rotate(-90deg) translate(-40%, -40%)',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, zIndex: 1 }}>
          <Box
            component="span"
            sx={{
              fontSize: '2rem',
              fontWeight: '500',
              color: 'black',
              paddingX: 2,
            }}
          >
            {translations.moduleVariables.Challenges}
          </Box>
        </Box>
        <Container maxWidth="md">
          <Box sx={{ borderRadius: 1, overflow: 'hidden' }}>
            {sections.map((section) => (
              <Accordion
                disableGutters
                key={section.id}
                sx={{ backgroundColor: 'rgb(251, 219, 229)' }}
                expanded={section.id === selectedSection}
                onChange={() => setSelectedSection(section.id === selectedSection ? null : section.id)}
              >
                <AccordionSummary>
                  <Typography sx={{ flexGrow: 1, pl: 1, fontSize: '1.2rem' }}>
                    {section.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>{section.date}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ py: 0, px: 0 }}>
                  <List sx={{ py: 0, backgroundColor: 'rgb(9, 22, 41)', color: 'white', mx: 2, borderRadius: 1 }}>
                    {section.challenges.map((challenge, idx) => (
                      <React.Fragment key={challenge.id}>
                        <ListItemButton
                          alignItems="center"
                          sx={{
                            py: 2,
                            my: 2,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                          }}
                          onClick={() => navigate(getLocalizedPath(language, `/${challenge.id}`))}
                        >
                          <ListItemAvatar sx={{ mt: 0, display: 'flex', justifyContent: 'center' }}>
                            {challenge.avatarId
                              ? <Avatar sx={{ width: { xs: '60px', sm: '50px' } }} src={`/api/uploads/w_200/${challenge.avatarId}.png`} />
                              : <Avatar sx={{ width: { xs: '60px', sm: '50px' } }} src="/musical-note.png" /> }
                          </ListItemAvatar>
                          <ListItemText sx={{ ml: { sm: 5 }, mt: { xs: 2, sm: 0 } }}>
                            <Box sx={{ display: 'flex' }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ fontSize: '1.2rem' }}>{challenge.name}</Box>
                                <Box sx={{ mt: 0.3 }}>{challenge.description}</Box>
                                <Box sx={{ fontSize: '1.1rem', mt: 2, display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                                  {translations.moduleVariables['Discover challenge']}
                                  <KeyboardArrowRightIcon sx={{ fontSize: '1.1rem', color: 'rgb(254, 196, 9)', ml: 0.5 }} />
                                </Box>
                              </Box>
                              <Box sx={{
                                textAlign: 'right',
                                alignSelf: 'center',
                                flexShrink: 0,
                                fontWeight: '500',
                                display: { xs: 'none', sm: 'flex' },
                                justifyContent: 'center',
                                flexDirection: 'column',
                              }}
                              >
                                <Box sx={{ fontSize: '2.0rem' }}>{challenge.entries || 0}</Box>
                                <Box sx={{ fontSize: '0.9rem', color: '#6e8599' }}>{translations.moduleVariables.participants}</Box>
                              </Box>
                            </Box>
                          </ListItemText>
                        </ListItemButton>
                        {idx !== section.challenges.length - 1 && (<Divider component="li" />)}
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

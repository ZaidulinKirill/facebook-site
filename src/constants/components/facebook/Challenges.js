/* eslint-disable react/no-danger */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, CircularProgress, Container, Divider,
  List, ListItemAvatar, ListItemButton, ListItemText,
  Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails, AccordionSummary as MuiAccordionSummary, Typography,
  styled,
} from '@mui/material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PageContext, SiteContext, UserContext } from '../../../contexts';
import getLocalizedPath from '../../../utils/getLocalizedPath';
import { PageRenderer } from '../../../services';
import FacebookNavbar from './Navbar';

const Avatar = styled('img')(() => ({
  width: '100px',
  height: '80px',
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
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
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function FacebookChallenges() {
  const page = useContext(PageContext);
  const userState = useContext(UserContext);
  const challengesStore = page.modules.find((x) => x.moduleType === 'facebook-challenges');
  const challengesText = page.modules.find((x) => x.moduleType === 'facebook-challenges-text');
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

  const modules = [
    challengesText,
  ].filter((x) => !!x);

  const pageRenderer = new PageRenderer({ modules, inline: true });

  return (
    <Box>
      {userState && userState[0] && <FacebookNavbar large />}
      {pageRenderer.render()}
      <Box sx={{ mt: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box
            component="span"
            sx={{
              fontSize: 28,
              fontWeight: '500',
              color: 'white',
              paddingX: 2,
              background: 'var(--primary-color)',
              mixBlendMode: 'multiply',
            }}
          >
            Challenges
          </Box>
        </Box>
        <Container maxWidth="md">
          {sections.map((section) => (
            <Accordion
              disableGutters
              key={section.id}
              expanded={section.id === selectedSection}
              onChange={() => setSelectedSection(section.id === selectedSection ? null : section.id)}
            >
              <AccordionSummary>
                <Typography sx={{ flexGrow: 1 }}>
                  {section.name}
                </Typography>
                {section.id === selectedSection && (<Typography sx={{ color: 'text.secondary' }}># Entries</Typography>)}
              </AccordionSummary>
              <AccordionDetails sx={{ py: 0, px: 0 }}>
                <List sx={{ py: 0 }}>
                  {section.challenges.map((challenge, idx) => (
                    <React.Fragment key={challenge.id}>
                      <ListItemButton
                        alignItems="center"
                        onClick={() => navigate(getLocalizedPath(language, `/${challenge.id}`))}
                      >
                        <ListItemAvatar sx={{ mt: 0 }}>
                          <Avatar src={`/api/uploads/w_200,h_160/${challenge.avatarId}`} />
                        </ListItemAvatar>
                        <ListItemText sx={{ ml: 1 }}>
                          <Box sx={{ display: 'flex' }}>
                            <Box sx={{ mt: '-1em', mb: '-1em' }}>
                              {challenge.description}
                            </Box>
                            <Box sx={{
                              width: '75px',
                              textAlign: 'right',
                              alignSelf: 'center',
                              fontSize: 28,
                              flexShrink: 0,
                              fontWeight: '500',
                            }}
                            >
                              {challenge.entries || 0}
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
        </Container>
      </Box>
    </Box>

  );
}

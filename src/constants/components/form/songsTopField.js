import React, { useContext, useEffect, useState } from 'react';
import {
  Box, CircularProgress, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography, styled,
} from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FormContext } from '../../../contexts';
import { AudioButton } from '../../../components/AudioButton';

const { REACT_APP_API_URL } = process.env;
const StyledSpan = styled('span')({});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const SongsTopField = ({ onChange, label, size = 'sm', numberOfSongs, description }) => {
  const [songs, setSongs] = useState(null);
  const [resetAudio, setResetAudio] = useState(false);
  const { form } = useContext(FormContext);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${REACT_APP_API_URL}/songs/top?formModuleId=${form.id}&stage=stage-1&limit=${numberOfSongs}`, {
        method: 'get',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const results = await response.json();
      setSongs(results);
      onChange({ target: { value: results } });
    })();
  }, []);

  const getItemStyle = (isDragging, draggableStyle) => ({
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: 'white',
    ...draggableStyle,
    transition: `${draggableStyle.transition}, box-shadow 0.1s`,
    ...(isDragging && {
      boxShadow: '0px 5px 43px 2px rgba(34, 60, 80, 0.2)',
    }),
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      songs,
      result.source.index,
      result.destination.index,
    );

    setSongs(items);
    onChange({ target: { value: items } });
  };

  return (
    <Box sx={{ width: '100%', '& >div': { width: '100%' } }}>
      {label && (
        <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>
          {label}
        </Box>
      )}
      {description && (
        <Box sx={{ mt: 1 }}>
          {description}
        </Box>
      )}
      <Box>
        {!songs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ marginLeft: 0, maxWidth: `${size * 10}%` }} disableGutters>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <List ref={provided.innerRef}>
                    {songs.map((item, index) => (
                      <Draggable key={item.trackId} draggableId={item.trackId} index={index}>
                        {(listItemProvided, listItemSnapshot) => (
                          <ListItem
                            ContainerComponent="li"
                            ref={listItemProvided.innerRef}
                            {...listItemProvided.draggableProps}
                            {...listItemProvided.dragHandleProps}
                            style={getItemStyle(
                              listItemSnapshot.isDragging,
                              listItemProvided.draggableProps.style,
                            )}
                          >
                            <ListItemAvatar sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                              <StyledSpan sx={{ fontSize: 20, fontWeight: 'bold' }}>
                                {index + 1}
                                .
                              </StyledSpan>
                            </ListItemAvatar>
                            <ListItemText>
                              <Grid container alignItems="center">
                                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box component="img" alt="Preview" src={item.artworkUrl100} sx={{ borderRadius: 2, width: '64px', height: '64px', objectFit: 'cover' }} />
                                </Grid>
                                <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 2, flexGrow: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ margin: 0, padding: 0 }}>
                                    <b>{item.artistName}</b>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ margin: 0, padding: 0 }}>
                                    {item.trackName}
                                  </Typography>
                                </Grid>
                                <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AudioButton
                                    url={item.previewUrl}
                                    reset={resetAudio}
                                    onPlay={() => { setResetAudio(true); setTimeout(() => { setResetAudio(false); }); }}
                                  />
                                </Grid>
                              </Grid>
                            </ListItemText>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        )}
      </Box>
    </Box>
  );
};

import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { LikesContent } from '../../likes';
import { UserContext } from '../../../contexts';

export function LikesArea({ refresh, onRefreshed, sx, where = {} }) {
  const [isInited, setIsInited] = useState(false);
  const [likes, setLikes] = useState([]);
  const [user] = useContext(UserContext);

  const { ref, inView } = useInView({
    fallbackInView: true,
  });

  useEffect(() => {
    if (isInited && !refresh) {
      return;
    }

    (async () => {
      const { data: { items } } = await axios.get('/api/posts/likes', {
        params: where,
      });

      const aggregated = Object.values(items.reduce((acc, item) => {
        acc[item.type] = acc[item.type] || [];
        acc[item.type].push(item);

        return acc;
      }, {})).map((group) => ({
        type: group[0].type,
        count: group.length,
        isActive: group.find((x) => x.userId === user.id),
      }));

      setLikes(aggregated);
      setIsInited(true);
      if (onRefreshed) {
        onRefreshed();
      }
    })();
  }, [inView, isInited, refresh]);

  return (
    <Box ref={ref} sx={[{ display: 'flex', mr: -1 }, sx]}>
      {likes.map((like) => (
        <Box key={like.type} sx={{ pr: 1, ...like.isActive && { fontWeight: 'bold' } }}>
          <Box component="span" sx={{ pr: 0.2 }}>{like.count}</Box>
          {LikesContent[like.type]}
        </Box>
      ))}
    </Box>
  );
}

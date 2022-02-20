import React, { useState } from 'react';
import {
  Box, Grid, IconButton, InputAdornment,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

export default function SearchPostSection({ onChange }) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState([]);

  const addSearch = () => {
    const newFilters = [...filters, { id: new Date().valueOf(), value: search }];
    setFilters(newFilters);
    onChange(newFilters);
    setSearch('');
  };

  const removeFilter = (filter) => {
    const newFilters = filters.filter((x) => x.id !== filter.id);
    setFilters(newFilters);
    onChange(newFilters);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (search.length >= 3) {
      addSearch();
    }
  };

  return (
    <Grid container sx={{ display: 'flex' }}>
      <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 }, pt: { xs: 3, md: 0 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: -1.3 }}>
          {filters.map((filter) => (
            <Box
              key={filter.id}
              sx={{
                height: '43px',
                backgroundColor: 'rgb(14, 23, 39)',
                color: 'white',
                fontSize: '0.9rem',
                mr: 1.3,
                mt: 1.3,
                display: 'flex',
                alignItems: 'center',
                padding: '6px 0px',
                paddingLeft: '14px',
                paddingRight: '7px',
                borderRadius: '50px',
              }}
            >
              {filter.value}
              <IconButton sx={{ color: 'white' }} size="small" onClick={() => removeFilter(filter)}>
                <CloseIcon sx={{ fontSize: '20px' }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
        <form onSubmit={onSubmit}>
          <TextField
            placeholder="Search for description, name or country"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              ...search?.length >= 3 && {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={addSearch}>
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: '100%',
              '.MuiOutlinedInput-root': {
                borderRadius: '50px',
              },
            }}
          />
        </form>
      </Grid>

    </Grid>
  );
}

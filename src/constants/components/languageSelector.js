import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { SiteContext } from '../../contexts';

export default function LanguageSelector({ disableScrollLock = true, ...props }) {
  const { site: { language, languages } } = useContext(SiteContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (lang) => () => {
    if (!language.implicit && lang.default) {
      window.location.href = `${window.location.origin}${window.location.pathname.replace(`/${language.code.toLowerCase()}`, '')}${window.location.search}`;
    } else if (!language.implicit && !lang.default) {
      window.location.href = `${window.location.origin}/${lang.code.toLowerCase()}${window.location.pathname.replace(`/${language.code.toLowerCase()}`, '')}${window.location.search}`;
    } else {
      window.location.href = `${window.location.origin}/${lang.code.toLowerCase()}${window.location.pathname}${window.location.search}`;
    }

    handleClose();
  };

  return (
    <>
      <Button
        {...props}
        onClick={openMenu}
      >
        {language.code}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        disableScrollLock={disableScrollLock}
        onClose={handleClose}
      >
        {languages.map((x) => (
          <MenuItem
            onClick={handleClick(x)}
            key={x.id}
            sx={{
              fontWeight: x.code === language.code ? 'bold' : 'normal',
            }}
          >
            {x.code.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

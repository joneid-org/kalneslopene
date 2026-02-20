import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function DropDownMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const buttonId = "om-oss-button";
  const menuId = "om-oss-menu";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id={buttonId}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Om oss
      </Button>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          Slik startet det
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Løpsinformasjon
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Løypekart
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Navn i blåløypa
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Løypa 200 for 200
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Historiske tilbakeblikk
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          Styret
        </MenuItem>
      </Menu>
    </div>
  );
}

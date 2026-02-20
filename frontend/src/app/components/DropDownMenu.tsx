import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { Link } from "react-router";

type DropDownMenuProps = {
  list: { path: string; label: string }[];
};
export default function DropDownMenu({ list }: DropDownMenuProps) {
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

      <Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
        {list.map((value) => (
          <MenuItem
            key={value.label}
            component={Link}
            to={value.path}
            onClick={handleClose}
            disableRipple
          >
            {value.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

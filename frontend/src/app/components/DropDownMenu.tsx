import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { Link } from "react-router";

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

			<Menu id={menuId} anchorEl={anchorEl} open={open} onClose={handleClose}>
				{[
					{ path: "/SlikStartetDet", label: "Slik startet det" },
					{ path: "/Løpsinformasjon", label: "Løpsinformasjon" },
					{ path: "/Løypekart", label: "Løypekart" },
					{ path: "/NavnIBlåløypa", label: "Navn i blåløypa" },
					{ path: "/LøypaToForTo", label: "Løypa 200 for 200" },
					{ path: "/Historie", label: "Historiske tilbakeblikk" },
					{ path: "/Styret", label: "Styret" },
				].map(({ path, label }) => (
					<MenuItem
						key={label}
						component={Link}
						to={path}
						onClick={handleClose}
						disableRipple
					>
						{label}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}

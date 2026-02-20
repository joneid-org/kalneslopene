import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useBoolean } from "@reactuses/core";
import { forwardRef } from "react";
import { Link } from "react-router";
import DropDownMenu from "../components/DropDownMenu.tsx";

export const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
  const {
    value: mobileOpen,
    setFalse,
    toggle: toggleMobile,
  } = useBoolean(false);
  const { value: omOssOpen, toggle: toggleOmOss } = useBoolean(false);

  const omOss = [
    { path: "/SlikStartetDet", label: "Slik startet det" },
    { path: "/Løpsinformasjon", label: "Løpsinformasjon" },
    { path: "/Løypekart", label: "Løypekart" },
    { path: "/NavnIBlåløypa", label: "Navn i blåløypa" },
    { path: "/LøypaToForTo", label: "Løypa 200 for 200" },
    { path: "/Historie", label: "Historiske tilbakeblikk" },
    { path: "/Styret", label: "Styret" },
  ];
  const headerBar = [
    { path: "/Resultater", label: "Resultater" },
    { path: "/Bilder", label: "Bilder" },
    { path: "/Statistikk", label: "Statistikk" },
    { path: "/Lopskalender", label: "Løpskalender" },
  ];

  return (
    <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between container mx-auto px-4 py-4">
        <div className="min-w-0">
          <Link to="/" className="flex items-center gap-2">
            <HomeIcon />
            <div className="min-w-0">
              <h1 className="font-bold text-xl truncate">Torsdagsløpet</h1>
            </div>
          </Link>
        </div>

        <div className="md:hidden">
          <IconButton onClick={toggleMobile} size="large">
            <MenuIcon />
          </IconButton>
        </div>

        <nav className="hidden md:flex gap-1 items-center">
          {headerBar.map(({ path, label }) => (
            <Link key={label} to={path}>
              <Button variant="text">{label}</Button>
            </Link>
          ))}
          <DropDownMenu list={omOss} />
        </nav>

        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={setFalse}
          slotProps={{ paper: { sx: { width: 280 } } }}
        >
          <nav aria-label="Mobile navigation">
            <List>
              {headerBar.map(({ path, label }) => (
                <ListItemButton
                  key={label}
                  component={Link}
                  to={path}
                  onClick={setFalse}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              ))}

              <ListItemButton onClick={toggleOmOss} aria-expanded={omOssOpen}>
                <ListItemText primary="Om oss" />
                {omOssOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={omOssOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {omOss.map(({ path, label }) => (
                    <ListItemButton
                      key={label}
                      sx={{ pl: 4 }}
                      component={Link}
                      to={path}
                      onClick={setFalse}
                    >
                      <ListItemText primary={label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          </nav>
        </Drawer>
      </div>
    </header>
  );
});

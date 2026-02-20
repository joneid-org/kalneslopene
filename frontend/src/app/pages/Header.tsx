import { Link } from "react-router";
import { forwardRef, useState } from "react";
import DropDownMenu from "../components/DropDownMenu.tsx";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [omOssOpen, setOmOssOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen((v) => !v);

  const toggleOmOss = () => setOmOssOpen((v) => !v);

  return (
    <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between container mx-auto px-4 py-4">
        {/* Header title */}
        <div className="min-w-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="min-w-0">
              <h1 className="font-bold text-xl truncate">Torsdagsløpet</h1>
              <p className="text-xs pl-1 text-gray-600 truncate">
                Kalnesskogen | Torsdag kl 18:00
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <IconButton
            aria-label="Open menu"
            onClick={toggleMobile}
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </div>

        {/* Desktop button row */}
        <nav className="hidden md:flex gap-1 items-center">
          <Link to={"/Statistikk"}>
            <Button variant="text">Resultater</Button>
          </Link>
          <Link to={"/Statistikk"}>
            <Button variant="text">Bilder</Button>
          </Link>
          <Link to={"/Statistikk"}>
            <Button variant="text">Statistikk</Button>
          </Link>
          <Link to={"/Lopskalender"}>
            <Button variant="text">Løpskalender</Button>
          </Link>
          <DropDownMenu />
        </nav>

        {/* Mobile drawer */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={closeMobile}
          PaperProps={{ sx: { width: 280 } }}
        >
          <nav aria-label="Mobile navigation">
            <List>
              <ListItemButton component={Link} to={"/Statistikk"} onClick={closeMobile}>
                <ListItemText primary="Resultater" />
              </ListItemButton>
              <ListItemButton component={Link} to={"/Statistikk"} onClick={closeMobile}>
                <ListItemText primary="Bilder" />
              </ListItemButton>
              <ListItemButton component={Link} to={"/Statistikk"} onClick={closeMobile}>
                <ListItemText primary="Statistikk" />
              </ListItemButton>
              <ListItemButton component={Link} to={"/Lopskalender"} onClick={closeMobile}>
                <ListItemText primary="Løpskalender" />
              </ListItemButton>

              {/* Om oss (nested) */}
              <ListItemButton onClick={toggleOmOss} aria-expanded={omOssOpen}>
                <ListItemText primary="Om oss" />
                {omOssOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={omOssOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Slik startet det" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Løpsinformasjon" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Løypekart" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Navn i blåløypa" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Løypa 200 for 200" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Historiske tilbakeblikk" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to={"/OmOss"}
                    onClick={closeMobile}
                  >
                    <ListItemText primary="Styret" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </nav>
        </Drawer>
      </div>
    </header>
  );
});
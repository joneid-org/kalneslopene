import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Results from "./Results.tsx";
import Collapse from "@mui/material/Collapse";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useState} from "react";

const drawerWidth = 240;

export default function Sidebar() {
    const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
    const numbers = ["1", "2", "3", "4", "5"];

    const [openYear, setOpenYear] = useState<string | null>(null);

    const handleToggleYear = (year: string) => {
        setOpenYear((prev) => (prev === year ? null : year));
    };

    return (
        <Box sx={{display: 'flex'}}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',

                        position: 'sticky',
                        top: 'var(--app-header-height, 0px)',
                        height: 'calc(100dvh - var(--app-header-height, 0px))',

                        overflowY: 'auto',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <List component="nav" disablePadding>
                    {years.map((year) => {
                        const isOpen = openYear === year;

                        return (
                            <Box key={year}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleToggleYear(year)}>
                                        <ListItemText primary={year}/>
                                        {isOpen ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItemButton>
                                </ListItem>

                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {numbers.map((n) => (
                                            <ListItem key={`${year}-${n}`} disablePadding>
                                                <ListItemButton sx={{pl: 4}}>
                                                    <ListItemText primary={n}/>
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        );
                    })}
                </List>
            </Drawer>

            <Box component="main" sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}>
                <Results/>
            </Box>
        </Box>
    );
}

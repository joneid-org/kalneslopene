import Box from "@mui/material/Box";
import Results from "../components/Results.tsx";

export function Resultater() {
    return (
        <div>
            <Box component="main" sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}>
                <Results/>
            </Box>        </div>
    );
}
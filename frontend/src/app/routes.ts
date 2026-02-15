import {createBrowserRouter} from 'react-router';
import {Layout} from './Layout.tsx';
import {Resultater} from './pages/Resultater.tsx';
import {Bilder} from "./pages/Bilder.tsx";
import {Statistikk} from "./pages/Statistikk.tsx";
import {Lopskalender} from "./pages/Lopskalender.tsx";
import {OmOss} from "./pages/OmOss.tsx";
import {Home} from "./pages/Home.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: "Resultater",
                Component: Resultater,
            },
            {
                path: "Bilder",
                Component: Bilder,
            },
            {
                path: "Statistikk",
                Component: Statistikk,
            },
            {
                path: "Lopskalender",
                Component: Lopskalender,
            },
            {
                path: "OmOss",
                Component: OmOss,
            },

        ],
    },
]);

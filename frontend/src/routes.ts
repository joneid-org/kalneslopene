import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout.tsx";
import { Bilder } from "./pages/Bilder.tsx";
import { Historie } from "./pages/Historie.tsx";
import { Home } from "./pages/Home.tsx";
import { Loypekart } from "./pages/Loypekart.tsx";
import { Resultater } from "./pages/Resultater.tsx";
import { Statistikk } from "./pages/Statistikk.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
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
        path: "Resultater/:year/:raceNumber",
        Component: Resultater,
      },
      {
        path: "Bilder",
        Component: Bilder,
      },
      {
        path: "Bilder/:year/:raceNumber",
        Component: Bilder,
      },
      {
        path: "Statistikk",
        Component: Statistikk,
      },
      {
        path: "Historie",
        Component: Historie,
      },
      {
        path: "Løypekart",
        Component: Loypekart,
      },
    ],
  },
]);

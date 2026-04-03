import { createBrowserRouter } from "react-router";
import { Admin } from "./pages/Admin.tsx";
import { Bilder } from "./pages/Bilder.tsx";
import { Historie } from "./pages/Historie.tsx";
import { Home } from "./pages/Home.tsx";
import { Layout } from "./Layout.tsx";
import { Loypekart } from "./pages/Loypekart.tsx";
import { Resultater } from "./pages/Resultater.tsx";
import { PersonligeRekorder } from "./pages/PersonligeRekorder.tsx";
import { Statistikk } from "./pages/Statistikk.tsx";
import { CRUDRaces } from "./pages/admin/CRUDRaces.tsx";
import { CRUDRunners } from "./pages/admin/CRUDRunners.tsx";
import { CRUDOrganizers } from "./pages/admin/CRUDOrganizers.tsx";
import { CRUDNewsfeeds } from "./pages/admin/CRUDNewsfeeds.tsx";
import { RegisterResults } from "./pages/admin/RegisterResults.tsx";

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
        path: "Resultater/:uuid",
        Component: Resultater,
      },
      {
        path: "Bilder",
        Component: Bilder,
      },
      {
        path: "Bilder/:uuid",
        Component: Bilder,
      },
      {
        path: "Statistikk",
        Component: Statistikk,
      },
      {
        path: "PersonligeRekorder",
        Component: PersonligeRekorder,
      },
      {
        path: "Historie",
        Component: Historie,
      },
      {
        path: "Løypekart",
        Component: Loypekart,
      },
      {
        path: "admin",
        Component: Admin,
      },
      {
        path: "admin/races",
        Component: CRUDRaces,
      },
      {
        path: "admin/results",
        Component: RegisterResults,
      },
      {
        path: "admin/runners",
        Component: CRUDRunners,
      },
      {
        path: "admin/organizers",
        Component: CRUDOrganizers,
      },
      {
        path: "admin/newsfeeds",
        Component: CRUDNewsfeeds,
      },
    ],
  },
]);

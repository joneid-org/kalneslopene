import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout.tsx";
import { Bilder } from "./pages/Bilder.tsx";
import { Historie } from "./pages/Historie.tsx";
import { Home } from "./pages/Home.tsx";
import { LopsInformasjon } from "./pages/LopsInformasjon.tsx";
import { Lopskalender } from "./pages/Lopskalender.tsx";
import { LoypaToForTo } from "./pages/LoypaToForTo.tsx";
import { Loypekart } from "./pages/Loypekart.tsx";
import { NavnILoypa } from "./pages/NavnILoypa.tsx";
import { OmOss } from "./pages/OmOss.tsx";
import { Resultater } from "./pages/Resultater.tsx";
import { Starten } from "./pages/Starten.tsx";
import { Statistikk } from "./pages/Statistikk.tsx";
import { Styret } from "./pages/Styret.tsx";

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
      {
        path: "Historie",
        Component: Historie,
      },
      {
        path: "Løpsinformasjon",
        Component: LopsInformasjon,
      },
      {
        path: "LøypaToForTo",
        Component: LoypaToForTo,
      },
      {
        path: "Løypekart",
        Component: Loypekart,
      },
      {
        path: "NavnIBlåløypa",
        Component: NavnILoypa,
      },
      {
        path: "SlikStartetDet",
        Component: Starten,
      },
      {
        path: "Styret",
        Component: Styret,
      },
    ],
  },
]);

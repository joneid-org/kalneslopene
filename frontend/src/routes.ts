import { createBrowserRouter } from "react-router";
import { NewsfeedTagManager } from "@/components/admin/NewsfeedTagManager.tsx";
import { ImagesPage } from "@/pages/admin/Images.tsx";
import { RaceCalendar } from "@/pages/RaceCalendar.tsx";
import { RouteError } from "@/pages/RouteError.tsx";
import { AuthGuard } from "./components/admin/AuthGuard.tsx";
import { Layout } from "./Layout.tsx";
import { Admin } from "./pages/Admin.tsx";
import { CRUDNewsfeeds } from "./pages/admin/CRUDNewsfeeds.tsx";
import { CRUDOrganizers } from "./pages/admin/CRUDOrganizers.tsx";
import { CRUDRaces } from "./pages/admin/CRUDRaces.tsx";
import { CRUDRunners } from "./pages/admin/CRUDRunners.tsx";
import { ImportResultsFromFile } from "./pages/admin/ImportResultsFromFile.tsx";
import { RegisterResults } from "./pages/admin/RegisterResults.tsx";
import { RegisterResultsWizard } from "./pages/admin/RegisterResultsWizard.tsx";
import { CourseMap } from "./pages/CourseMap.tsx";
import { History } from "./pages/History.tsx";
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { News } from "./pages/News.tsx";
import { NewsArticle } from "./pages/NewsArticle.tsx";
import { NewsTag } from "./pages/NewsTag.tsx";
import { Pictures } from "./pages/Pictures.tsx";
import { Results } from "./pages/Results.tsx";
import { Statistics } from "./pages/Statistics.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: RouteError,
    children: [
      {
        ErrorBoundary: RouteError,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "Resultater",
            Component: Results,
          },
          {
            path: "Resultater/:uuid",
            Component: Results,
          },
          {
            path: "Bilder/:uuid",
            Component: Pictures,
          },
          {
            path: "Statistikk",
            Component: Statistics,
          },
          {
            path: "Historie",
            Component: History,
          },
          {
            path: "Løypekart",
            Component: CourseMap,
          },
          {
            path: "Løpskalender",
            Component: RaceCalendar,
          },
          {
            path: "nyheter",
            Component: News,
          },
          {
            path: "nyheter/tag/:tag",
            Component: NewsTag,
          },
          {
            path: "nyheter/:uuid",
            Component: NewsArticle,
          },
          {
            path: "logg-inn",
            Component: Login,
          },
          {
            Component: AuthGuard,
            children: [
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
                path: "admin/results/import",
                Component: ImportResultsFromFile,
              },
              {
                path: "admin/results/:uuid",
                Component: RegisterResultsWizard,
              },
              {
                path: "admin/images",
                Component: ImagesPage,
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
              {
                path: "admin/tags",
                Component: NewsfeedTagManager,
              },
            ],
          },
          {
            path: "*",
            Component: RouteError,
          },
        ],
      },
    ],
  },
]);

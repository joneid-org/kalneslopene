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
            path: "resultater",
            Component: Results,
          },
          {
            path: "resultater/:uuid",
            Component: Results,
          },
          {
            path: "bilder/:uuid",
            Component: Pictures,
          },
          {
            path: "statistikk",
            Component: Statistics,
          },
          {
            path: "historie",
            Component: History,
          },
          {
            path: "løypekart",
            Component: CourseMap,
          },
          {
            path: "løpskalender",
            Component: RaceCalendar,
          },
          {
            path: "nyheter",
            Component: News,
          },
          {
            path: "nyheter/tagg/:tag",
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
                path: "admin/løp",
                Component: CRUDRaces,
              },
              {
                path: "admin/resultater",
                Component: RegisterResults,
              },
              {
                path: "admin/resultater/import",
                Component: ImportResultsFromFile,
              },
              {
                path: "admin/resultater/:uuid",
                Component: RegisterResultsWizard,
              },
              {
                path: "admin/bilder",
                Component: ImagesPage,
              },
              {
                path: "admin/løpere",
                Component: CRUDRunners,
              },
              {
                path: "admin/arrangører",
                Component: CRUDOrganizers,
              },
              {
                path: "admin/nyheter",
                Component: CRUDNewsfeeds,
              },
              {
                path: "admin/tagger",
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

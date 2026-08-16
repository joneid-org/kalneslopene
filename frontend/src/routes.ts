import { createBrowserRouter } from "react-router";
import { RouteError } from "@/pages/RouteError.tsx";
import { AuthGuard } from "./components/admin/AuthGuard.tsx";
import { Layout } from "./Layout.tsx";
import { Home } from "./pages/Home.tsx";

const results = async () => ({
  Component: (await import("./pages/Results.tsx")).Results,
});

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
            lazy: results,
          },
          {
            path: "resultater/:uuid",
            lazy: results,
          },
          {
            path: "bilder/:uuid",
            lazy: async () => ({
              Component: (await import("./pages/Pictures.tsx")).Pictures,
            }),
          },
          {
            path: "statistikk",
            lazy: async () => ({
              Component: (await import("./pages/Statistics.tsx")).Statistics,
            }),
          },
          {
            path: "historie",
            lazy: async () => ({
              Component: (await import("./pages/History.tsx")).History,
            }),
          },
          {
            path: "løypekart",
            lazy: async () => ({
              Component: (await import("./pages/CourseMap.tsx")).CourseMap,
            }),
          },
          {
            path: "løpskalender",
            lazy: async () => ({
              Component: (await import("./pages/RaceCalendar.tsx"))
                .RaceCalendar,
            }),
          },
          {
            path: "nyheter",
            lazy: async () => ({
              Component: (await import("./pages/News.tsx")).News,
            }),
          },
          {
            path: "nyheter/tagg/:tag",
            lazy: async () => ({
              Component: (await import("./pages/NewsTag.tsx")).NewsTag,
            }),
          },
          {
            path: "nyheter/:uuid",
            lazy: async () => ({
              Component: (await import("./pages/NewsArticle.tsx")).NewsArticle,
            }),
          },
          {
            path: "logg-inn",
            lazy: async () => ({
              Component: (await import("./pages/Login.tsx")).Login,
            }),
          },
          {
            path: "invitasjon/:token",
            lazy: async () => ({
              Component: (await import("./pages/RedeemInvite.tsx"))
                .RedeemInvite,
            }),
          },
          {
            Component: AuthGuard,
            children: [
              {
                path: "admin",
                lazy: async () => ({
                  Component: (await import("./pages/Admin.tsx")).Admin,
                }),
              },
              {
                path: "admin/løp",
                lazy: async () => ({
                  Component: (await import("./pages/admin/CRUDRaces.tsx"))
                    .CRUDRaces,
                }),
              },
              {
                path: "admin/resultater",
                lazy: async () => ({
                  Component: (await import("./pages/admin/RegisterResults.tsx"))
                    .RegisterResults,
                }),
              },
              {
                path: "admin/resultater/import",
                lazy: async () => ({
                  Component: (
                    await import("./pages/admin/ImportResultsFromFile.tsx")
                  ).ImportResultsFromFile,
                }),
              },
              {
                path: "admin/resultater/:uuid",
                lazy: async () => ({
                  Component: (
                    await import("./pages/admin/RegisterResultsWizard.tsx")
                  ).RegisterResultsWizard,
                }),
              },
              {
                path: "admin/bilder",
                lazy: async () => ({
                  Component: (await import("./pages/admin/Images.tsx"))
                    .ImagesPage,
                }),
              },
              {
                path: "admin/løpere",
                lazy: async () => ({
                  Component: (await import("./pages/admin/CRUDRunners.tsx"))
                    .CRUDRunners,
                }),
              },
              {
                path: "admin/arrangører",
                lazy: async () => ({
                  Component: (await import("./pages/admin/CRUDOrganizers.tsx"))
                    .CRUDOrganizers,
                }),
              },
              {
                path: "admin/nyheter",
                lazy: async () => ({
                  Component: (await import("./pages/admin/CRUDNewsfeeds.tsx"))
                    .CRUDNewsfeeds,
                }),
              },
              {
                path: "admin/tagger",
                lazy: async () => ({
                  Component: (
                    await import("./components/admin/NewsfeedTagManager.tsx")
                  ).NewsfeedTagManager,
                }),
              },
              {
                path: "admin/brukere",
                lazy: async () => ({
                  Component: (await import("./pages/admin/CRUDUsers.tsx"))
                    .CRUDUsers,
                }),
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

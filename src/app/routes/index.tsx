import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { Spinner } from "@/shared/ui";

const RickMortyHomePage = lazy(() =>
  import("@/features/rickmorty/pages/home/Home").then((m) => ({ default: m.RickMortyHomePage }))
);
const RickMortyDetailPage = lazy(() =>
  import("@/features/rickmorty/pages/details/Detail").then((m) => ({ default: m.RickMortyDetailPage }))
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense
            fallback={
                <Spinner />
            }
          >
            <RickMortyHomePage />
          </Suspense>
        ),
      },
      {
        path: "/:resource/:id",
        element: (
          <Suspense
            fallback={
                <Spinner />
            }
          >
            <RickMortyDetailPage />
          </Suspense>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

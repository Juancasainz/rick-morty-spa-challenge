import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/app/layout/AppLayout";
import { RickMortyHomePage } from "@/features/rickmorty/pages/home/Home";
import { RickMortyDetailPage } from "@/features/rickmorty/pages/details/Detail";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <RickMortyHomePage /> },
      { path: "/:resource/:id", element: <RickMortyDetailPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

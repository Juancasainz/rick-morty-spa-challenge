import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { RickMortyHomePage } from "../../src/features/rickmorty/pages/home/Home";
import { RickMortyDetailPage } from "../../src/features/rickmorty/pages/details/Detail";

const API = "https://rickandmortyapi.com/api";

describe("API error integration", () => {
  it("shows list error UI when home request fails", async () => {
    server.use(
      http.get(`${API}/character`, () =>
        HttpResponse.json({ error: "Internal Server Error" }, { status: 500 })
      )
    );

    const router = createMemoryRouter([{ path: "/", element: <RickMortyHomePage /> }], {
      initialEntries: ["/?resource=characters&page=1"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText(/couldn.t load results/i)).toBeInTheDocument();
  });

  it("shows detail error UI when detail request fails", async () => {
    server.use(
      http.get(`${API}/episode/:id`, () =>
        HttpResponse.json({ error: "Internal Server Error" }, { status: 500 })
      )
    );

    const router = createMemoryRouter(
      [{ path: "/:resource/:id", element: <RickMortyDetailPage /> }],
      { initialEntries: ["/episodes/1"] }
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText(/couldn.t load details/i)).toBeInTheDocument();
  });
});

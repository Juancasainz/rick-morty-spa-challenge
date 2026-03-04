import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RickMortyDetailPage } from "../../src/features/rickmorty/pages/details/Detail";

describe("Detail integration", () => {
  it("loads detail fields and related carousel items", async () => {
    const router = createMemoryRouter(
      [{ path: "/:resource/:id", element: <RickMortyDetailPage /> }],
      { initialEntries: ["/episodes/1"] }
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Pilot")).toBeInTheDocument();
    expect(screen.getByText("Code")).toBeInTheDocument();
    expect(screen.getByText("S01E01")).toBeInTheDocument();
    expect(screen.getByText("Air date")).toBeInTheDocument();
    expect(screen.getByText("December 2, 2013")).toBeInTheDocument();

    expect(await screen.findByText("Related characters (2)")).toBeInTheDocument();
    expect(await screen.findByText("Rick Sanchez")).toBeInTheDocument();
    expect(await screen.findByText("Morty Smith")).toBeInTheDocument();
  });
});

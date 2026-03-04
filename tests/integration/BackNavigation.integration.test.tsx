import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RickMortyHomePage } from "../../src/features/rickmorty/pages/home/Home";
import { RickMortyDetailPage } from "../../src/features/rickmorty/pages/details/Detail";

describe("Back navigation integration", () => {
  it("keeps filter/sort/pagination state after going to detail and back", async () => {
    const user = userEvent.setup();
    const initialSearch = "?resource=characters&name=rick&status=alive&dir=desc&page=2";
    const router = createMemoryRouter(
      [
        { path: "/", element: <RickMortyHomePage /> },
        { path: "/:resource/:id", element: <RickMortyDetailPage /> },
      ],
      { initialEntries: [`/${initialSearch}`] }
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Rick Sanchez")).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: /open details for rick sanchez/i }));
    expect(await screen.findByText("characters details")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
      expect(router.state.location.search).toBe(initialSearch);
    });
  });
});

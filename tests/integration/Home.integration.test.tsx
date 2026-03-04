import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { RickMortyHomePage } from "../../src/features/rickmorty/pages/home/Home";

describe("Home integration", () => {
  it("renders items, applies filter and updates URL state", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter([{ path: "/", element: <RickMortyHomePage /> }], {
      initialEntries: ["/?resource=characters&page=1"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Rick Sanchez")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Status"), "dead");

    await waitFor(() => {
      expect(router.state.location.search).toContain("status=dead");
      expect(router.state.location.search).toContain("page=1");
    });

    expect(await screen.findByText("Albert Einstein")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Rick Sanchez")).not.toBeInTheDocument();
    });
  });
});

import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider, useLocation } from "react-router-dom";
import { useSearchParamsQuery } from "../../src/features/rickmorty/shared/useSearchParamsQuery";

function Harness() {
  const q = useSearchParamsQuery();
  const location = useLocation();

  return (
    <div>
      <input aria-label="name-input" {...q.bindText("name", 300)} />
      <button onClick={() => q.set({ status: "dead" })}>set-status</button>
      <button onClick={() => q.set({ status: "alive" }, false)}>set-status-no-reset</button>
      <span data-testid="resource">{q.resource}</span>
      <span data-testid="page">{String(q.page)}</span>
      <span data-testid="search">{location.search}</span>
    </div>
  );
}

describe("useSearchParamsQuery integration", () => {
  it("uses sensible defaults when query is empty", () => {
    const router = createMemoryRouter([{ path: "/", element: <Harness /> }], {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("resource")).toHaveTextContent("characters");
    expect(screen.getByTestId("page")).toHaveTextContent("1");
    expect(screen.getByLabelText("name-input")).toHaveValue("");
  });

  it("set() updates params and resets page by default", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter([{ path: "/", element: <Harness /> }], {
      initialEntries: ["/?resource=characters&page=3"],
    });

    render(<RouterProvider router={router} />);
    await user.click(screen.getByRole("button", { name: "set-status" }));

    await waitFor(() => {
      expect(screen.getByTestId("search")).toHaveTextContent("status=dead");
      expect(screen.getByTestId("search")).toHaveTextContent("page=1");
    });
  });

  it("set() can keep page when resetPage=false", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter([{ path: "/", element: <Harness /> }], {
      initialEntries: ["/?resource=characters&page=3"],
    });

    render(<RouterProvider router={router} />);
    await user.click(screen.getByRole("button", { name: "set-status-no-reset" }));

    await waitFor(() => {
      expect(screen.getByTestId("search")).toHaveTextContent("status=alive");
      expect(screen.getByTestId("search")).toHaveTextContent("page=3");
    });
  });

  it("bindText updates draft immediately and URL after debounce", async () => {
    vi.useFakeTimers();
    const router = createMemoryRouter([{ path: "/", element: <Harness /> }], {
      initialEntries: ["/?resource=characters&page=4"],
    });

    render(<RouterProvider router={router} />);
    const input = screen.getByLabelText("name-input");

    fireEvent.change(input, { target: { value: "rick" } });
    expect(input).toHaveValue("rick");
    expect(screen.getByTestId("search")).toHaveTextContent("page=4");
    expect(screen.getByTestId("search")).not.toHaveTextContent("name=rick");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId("search")).toHaveTextContent("name=rick");
    expect(screen.getByTestId("search")).toHaveTextContent("page=1");

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
});

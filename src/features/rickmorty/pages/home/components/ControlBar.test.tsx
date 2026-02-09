import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

const setMock = vi.fn();
const bindTextMock = vi.fn();

vi.mock("@/features/rickmorty/shared/useSearchParamsQuery.ts", () => {
  return {
    useSearchParamsQuery: () => ({
      resource: "characters",
      dir: "asc",
      page: 2,
      name: "Rick",
      status: "",
      gender: "",
      episode: "",
      type: "",
      dimension: "",
      set: setMock,
      bindText: bindTextMock,
    }),
  };
});

vi.mock("./Pagination", () => ({
  Pagination: ({ page, pages }: any) => (
    <div data-testid="pagination">
      Page {page} / {pages ?? "?"}
    </div>
  ),
}));

import { ControlBar } from "./ControlBar";

describe("ControlBar", () => {
  beforeEach(() => {
    setMock.mockClear();
    bindTextMock.mockClear();

    bindTextMock.mockImplementation((key: string) => ({
      value: key === "name" ? "Rick" : "",
      onChange: vi.fn(),
    }));
  });

 it("shows header and renders search + character filters", () => {
  render(
    <MemoryRouter>
      <ControlBar pages={42} />
    </MemoryRouter>
  );

  expect(screen.getByText(/Browse characters/i)).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /search/i })).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /status/i })).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: /gender/i })).toBeInTheDocument();
  expect(screen.getByTestId("pagination")).toHaveTextContent("Page 2 / 42");
});


  it("clicking a resource button updates query params", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ControlBar pages={10} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /episodes/i }));

    expect(setMock).toHaveBeenCalled();
    expect(setMock.mock.calls[0][0]).toMatchObject({ resource: "episodes" });
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlBar } from "../../src/features/rickmorty/pages/home/components/ControlBar";

// 1) Mock Pagination para no testearla aquí y poder verificar props
vi.mock("../../src/features/rickmorty/pages/home/components/Pagination", () => ({
  Pagination: (props: { page: number; pages?: number }) => (
    <div data-testid="pagination">
      page:{props.page}-pages:{props.pages ?? "?"}
    </div>
  ),
}));

// 2) Mock del hook
type Q = {
  resource: "characters" | "episodes" | "locations";
  name: string;
  dir: "asc" | "desc";
  status: string;
  gender: string;
  episode: string;
  type: string;
  dimension: string;
  page: number;
  set: (patch: Record<string, unknown>) => void;
  bindText: (key: TextKey) => { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void };
};

type TextKey = "name" | "episode" | "type" | "dimension";

let currentQ: Q;

vi.mock("@/features/rickmorty/shared/useSearchParamsQuery.ts", () => ({
  useSearchParamsQuery: () => currentQ,
}));

function makeQ(overrides?: Partial<Q>): Q {
  const set = vi.fn();
  const changeHandlers: Record<TextKey, (value: string) => void> = {
    name: vi.fn(),
    episode: vi.fn(),
    type: vi.fn(),
    dimension: vi.fn(),
  };

  const baseValues: Record<TextKey, string> = {
    name: "",
    episode: "",
    type: "",
    dimension: "",
  };

  const withOverrides = {
    ...baseValues,
    ...(overrides
      ? {
          name: overrides.name ?? baseValues.name,
          episode: overrides.episode ?? baseValues.episode,
          type: overrides.type ?? baseValues.type,
          dimension: overrides.dimension ?? baseValues.dimension,
        }
      : {}),
  };

  return {
    resource: "characters",
    name: "",
    dir: "asc",
    status: "",
    gender: "",
    episode: "",
    type: "",
    dimension: "",
    page: 1,
    set,
    bindText: (key) => ({
      value: withOverrides[key] ?? currentQ[key],
      onChange: (e) => changeHandlers[key]?.(e.target.value),
    }),
    ...overrides,
  };
}

beforeEach(() => {
  currentQ = makeQ();
  vi.clearAllMocks();
});

describe("ControlBar", () => {
  it("renders base UI + pagination props", () => {
    render(<ControlBar pages={5} />);
    expect(screen.getByText(/Browse characters/i)).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toHaveTextContent("page:1-pages:5");
  });

  it("shows characters filters (Status/Gender) when resource=characters", () => {
    currentQ = makeQ({ resource: "characters" });
    render(<ControlBar pages={1} />);

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Gender")).toBeInTheDocument();

    // no debería mostrar episode/type/dimension
    expect(screen.queryByLabelText("Episode:")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Type")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Dimension")).not.toBeInTheDocument();
  });

  it("shows episode input when resource=episodes", () => {
    currentQ = makeQ({ resource: "episodes" });
    render(<ControlBar pages={1} />);
    expect(screen.getByLabelText("Episode:")).toBeInTheDocument();

    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Gender")).not.toBeInTheDocument();
  });

  it("shows location inputs when resource=locations", () => {
    currentQ = makeQ({ resource: "locations" });
    render(<ControlBar pages={1} />);

    expect(screen.getByLabelText("Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Dimension")).toBeInTheDocument();
    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
  });

  it("clicking resource button calls q.set with resource + reset patch", async () => {
    const user = userEvent.setup();
    render(<ControlBar pages={1} />);

    await user.click(screen.getByRole("button", { name: "episodes" }));

    // patch exacto del componente
    expect(currentQ.set).toHaveBeenCalledWith({
      resource: "episodes",
      status: undefined,
      gender: undefined,
      episode: undefined,
      type: undefined,
      dimension: undefined,
    });
  });

  it("clear filters calls q.set with RESET_FILTERS_PATCH", async () => {
    const user = userEvent.setup();
    render(<ControlBar pages={1} />);

    await user.click(screen.getByRole("button", { name: /clear filters/i }));

    expect(currentQ.set).toHaveBeenCalledWith({
      name: undefined,
      status: undefined,
      gender: undefined,
      episode: undefined,
      type: undefined,
      dimension: undefined,
    });
  });

  it("sort select calls q.set", async () => {
    const user = userEvent.setup();
    render(<ControlBar pages={1} />);

    await user.selectOptions(screen.getByLabelText("Sort"), "desc");
    expect(currentQ.set).toHaveBeenCalledWith({ dir: "desc" });
  });

  it("status/gender selects call q.set when resource=characters", async () => {
    const user = userEvent.setup();
    currentQ = makeQ({ resource: "characters" });
    render(<ControlBar pages={1} />);

    await user.selectOptions(screen.getByLabelText("Status"), "alive");
    expect(currentQ.set).toHaveBeenCalledWith({ status: "alive" });

    await user.selectOptions(screen.getByLabelText("Gender"), "female");
    expect(currentQ.set).toHaveBeenCalledWith({ gender: "female" });
  });
});

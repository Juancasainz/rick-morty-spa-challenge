import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ItemCard } from "./ItemCard";

describe("ItemCard", () => {
  it("renders character title, subtitle and link", () => {
    const item: any = {
      id: 1,
      name: "Rick Sanchez",
      status: "Alive",
      species: "Human",
      image: "https://example.com/rick.png",
    };

    render(
      <MemoryRouter>
        <ItemCard resource="characters" item={item} />
      </MemoryRouter>
    );

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText(/Alive\s•\sHuman/i)).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /open details for rick sanchez/i });
    expect(link).toHaveAttribute("href", "/characters/1");
  });

  it("renders episode subtitle", () => {
    const item: any = {
      id: 10,
      name: "Close Rick-counters of the Rick Kind",
      episode: "S01E10",
      air_date: "April 7, 2014",
    };

    render(
      <MemoryRouter>
        <ItemCard resource="episodes" item={item} />
      </MemoryRouter>
    );

    expect(screen.getByText("Close Rick-counters of the Rick Kind")).toBeInTheDocument();
    expect(screen.getByText(/S01E10\s•\sApril 7, 2014/i)).toBeInTheDocument();
  });
});

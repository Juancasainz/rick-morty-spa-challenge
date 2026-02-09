import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const useRelatedItemsMock = vi.fn();

vi.mock("@/features/rickmorty/hooks/useRelatedItems", () => ({
  useRelatedItems: (...args: any[]) => useRelatedItemsMock(...args),
}));

import { RelatedCarousel } from "./RelatedCarousel";

describe("RelatedCarousel", () => {
  beforeEach(() => {
    useRelatedItemsMock.mockReset();

    // default mock: 8 loaded out of 16
    useRelatedItemsMock.mockImplementation((_resource: any, _item: any, limit: number) => {
      const total = 16;
      const loaded = Math.min(total, limit);
      const relatedItems = Array.from({ length: loaded }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        status: "Alive",
        species: "Human",
        image: "https://example.com/a.png",
      }));
      return {
        relatedResource: "characters",
        relatedItems,
        isLoading: false,
        total,
        loaded,
      };
    });
  });

  it("renders related header and items", () => {
    render(
      <MemoryRouter>
        <RelatedCarousel resource="episodes" item={{ id: 99 }} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Related characters \(16\)/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("loads more when scrolled near the end", () => {
    render(
      <MemoryRouter>
        <RelatedCarousel resource="episodes" item={{ id: 99 }} />
      </MemoryRouter>
    );

    const scroller = document.querySelector(".overflow-x-auto") as HTMLDivElement;
    expect(scroller).toBeTruthy();

    Object.defineProperty(scroller, "clientWidth", { value: 500, configurable: true });
    Object.defineProperty(scroller, "scrollWidth", { value: 1000, configurable: true });
    Object.defineProperty(scroller, "scrollLeft", { value: 600, configurable: true });

    fireEvent.scroll(scroller);

    const calls = useRelatedItemsMock.mock.calls;
    expect(calls.length).toBeGreaterThan(1);
    const lastCall = calls[calls.length - 1];
    expect(lastCall[2]).toBeGreaterThan(8);
  });
});

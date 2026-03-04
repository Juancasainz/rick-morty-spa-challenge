import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { RelatedCarousel } from "../../src/features/rickmorty/pages/details/components/RelatedCarousel";
import type { Character, Episode } from "../../src/features/rickmorty/model/types";

const API = "https://rickandmortyapi.com/api";

function makeCharacter(id: number): Character {
  return {
    id,
    name: `Character ${id}`,
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth", url: `${API}/location/1` },
    location: { name: "Earth", url: `${API}/location/1` },
    image: "https://example.com/char.png",
    episode: [],
    url: `${API}/character/${id}`,
    created: "2017-11-04T18:48:46.250Z",
  };
}

function makeEpisodeWithCharacters(total: number): Episode {
  return {
    id: 99,
    name: "Episode test",
    air_date: "December 2, 2013",
    episode: "S01E01",
    characters: Array.from({ length: total }, (_, i) => `${API}/character/${i + 1}`),
    url: `${API}/episode/99`,
    created: "2017-11-10T12:56:33.798Z",
  };
}

describe("RelatedCarousel (MSW)", () => {
  it("renders related header and items from API", async () => {
    server.use(
      http.get(`${API}/character/:ids`, ({ params }) => {
        const ids = String(params.ids)
          .split(",")
          .map((v) => Number(v))
          .filter(Boolean);

        return HttpResponse.json(ids.map(makeCharacter));
      })
    );

    render(
      <MemoryRouter>
        <RelatedCarousel resource="episodes" item={makeEpisodeWithCharacters(16)} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Related characters \(16\)/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByRole("link").length).toBe(8);
    });
  });

  it("loads more when scrolled near the end", async () => {
    server.use(
      http.get(`${API}/character/:ids`, ({ params }) => {
        const ids = String(params.ids)
          .split(",")
          .map((v) => Number(v))
          .filter(Boolean);

        return HttpResponse.json(ids.map(makeCharacter));
      })
    );

    render(
      <MemoryRouter>
        <RelatedCarousel resource="episodes" item={makeEpisodeWithCharacters(16)} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByRole("link").length).toBe(8);
    });

    const scroller = document.querySelector(".overflow-x-auto") as HTMLDivElement;
    expect(scroller).toBeTruthy();

    Object.defineProperty(scroller, "clientWidth", { value: 500, configurable: true });
    Object.defineProperty(scroller, "scrollWidth", { value: 1000, configurable: true });
    Object.defineProperty(scroller, "scrollLeft", { value: 600, configurable: true });

    fireEvent.scroll(scroller);

    await waitFor(() => {
      expect(screen.getAllByRole("link").length).toBe(16);
    });
  });
});

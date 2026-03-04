import { http, HttpResponse } from "msw";
import type { Character, Episode, Location } from "../../src/features/rickmorty/model/types";

const API = "https://rickandmortyapi.com/api";
const PAGE_SIZE = 2;

const characters: Character[] = [
  {
    id: 1,
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: `${API}/location/1` },
    location: { name: "Citadel of Ricks", url: `${API}/location/3` },
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: [`${API}/episode/1`, `${API}/episode/2`],
    url: `${API}/character/1`,
    created: "2017-11-04T18:48:46.250Z",
  },
  {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "unknown", url: "" },
    location: { name: "Citadel of Ricks", url: `${API}/location/3` },
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
    episode: [`${API}/episode/1`],
    url: `${API}/character/2`,
    created: "2017-11-04T18:50:21.651Z",
  },
  {
    id: 3,
    name: "Albert Einstein",
    status: "Dead",
    species: "Human",
    type: "",
    gender: "Male",
    origin: { name: "Earth (C-137)", url: `${API}/location/1` },
    location: { name: "Earth (Replacement Dimension)", url: `${API}/location/20` },
    image: "https://rickandmortyapi.com/api/character/avatar/11.jpeg",
    episode: [`${API}/episode/2`],
    url: `${API}/character/3`,
    created: "2017-11-04T20:20:20.965Z",
  },
];

const episodes: Episode[] = [
  {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
    characters: [`${API}/character/1`, `${API}/character/2`],
    url: `${API}/episode/1`,
    created: "2017-11-10T12:56:33.798Z",
  },
  {
    id: 2,
    name: "Lawnmower Dog",
    air_date: "December 9, 2013",
    episode: "S01E02",
    characters: [`${API}/character/1`, `${API}/character/3`],
    url: `${API}/episode/2`,
    created: "2017-11-10T12:56:33.916Z",
  },
];

const locations: Location[] = [
  {
    id: 1,
    name: "Earth (C-137)",
    type: "Planet",
    dimension: "Dimension C-137",
    residents: [`${API}/character/1`, `${API}/character/2`],
    url: `${API}/location/1`,
    created: "2017-11-10T12:42:04.162Z",
  },
  {
    id: 3,
    name: "Citadel of Ricks",
    type: "Space station",
    dimension: "unknown",
    residents: [`${API}/character/1`, `${API}/character/2`],
    url: `${API}/location/3`,
    created: "2017-11-10T13:08:13.191Z",
  },
];

function toIds(param: string) {
  return decodeURIComponent(param)
    .split(",")
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v));
}

function paginate<T>(items: T[], page: number, pathname: string) {
  const count = items.length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * PAGE_SIZE;
  const results = items.slice(start, start + PAGE_SIZE);

  const next = current < pages ? `${API}${pathname}?page=${current + 1}` : null;
  const prev = current > 1 ? `${API}${pathname}?page=${current - 1}` : null;

  return { info: { count, pages, next, prev }, results };
}

export const handlers = [
  http.get(`${API}/character`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const name = (url.searchParams.get("name") ?? "").toLowerCase();
    const status = (url.searchParams.get("status") ?? "").toLowerCase();
    const gender = (url.searchParams.get("gender") ?? "").toLowerCase();

    const filtered = characters.filter((c) => {
      if (name && !c.name.toLowerCase().includes(name)) return false;
      if (status && c.status.toLowerCase() !== status) return false;
      if (gender && c.gender.toLowerCase() !== gender) return false;
      return true;
    });

    return HttpResponse.json(paginate(filtered, page, "/character"));
  }),

  http.get(`${API}/episode`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const name = (url.searchParams.get("name") ?? "").toLowerCase();
    const code = (url.searchParams.get("episode") ?? "").toLowerCase();

    const filtered = episodes.filter((e) => {
      if (name && !e.name.toLowerCase().includes(name)) return false;
      if (code && !e.episode.toLowerCase().includes(code)) return false;
      return true;
    });

    return HttpResponse.json(paginate(filtered, page, "/episode"));
  }),

  http.get(`${API}/location`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const name = (url.searchParams.get("name") ?? "").toLowerCase();
    const type = (url.searchParams.get("type") ?? "").toLowerCase();
    const dimension = (url.searchParams.get("dimension") ?? "").toLowerCase();

    const filtered = locations.filter((l) => {
      if (name && !l.name.toLowerCase().includes(name)) return false;
      if (type && !l.type.toLowerCase().includes(type)) return false;
      if (dimension && !l.dimension.toLowerCase().includes(dimension)) return false;
      return true;
    });

    return HttpResponse.json(paginate(filtered, page, "/location"));
  }),

  http.get(`${API}/character/:id`, ({ params }) => {
    const ids = toIds(String(params.id));
    const found = characters.filter((c) => ids.includes(c.id));
    if (ids.length > 1) return HttpResponse.json(found);
    if (!found[0]) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(found[0]);
  }),

  http.get(`${API}/episode/:id`, ({ params }) => {
    const ids = toIds(String(params.id));
    const found = episodes.filter((e) => ids.includes(e.id));
    if (ids.length > 1) return HttpResponse.json(found);
    if (!found[0]) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(found[0]);
  }),

  http.get(`${API}/location/:id`, ({ params }) => {
    const ids = toIds(String(params.id));
    const found = locations.filter((l) => ids.includes(l.id));
    if (ids.length > 1) return HttpResponse.json(found);
    if (!found[0]) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(found[0]);
  }),
];

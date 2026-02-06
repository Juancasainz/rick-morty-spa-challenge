# Rick & Morty SPA — Frontend Technical Challenge

Single Page Application built with **React + TypeScript + Vite**, connected to the public **Rick and Morty API**.

## Features

- **Listing** screen
  - Browse **Characters**, **Episodes** and **Locations**
  - Each item displays **title + image** (episodes/locations use a placeholder image)
  - **Sort by title** (A→Z / Z→A)
  - **Filter** by:
    - Title search (all resources)
    - Character status + gender
    - Episode code (e.g. `S01`, `S01E05`)
    - Location type + dimension
  - Pagination (Prev/Next) using the API `page` param

- **Details** screen
  - Dedicated details page for any selected item
  - Back navigation to keep browsing the same resource

## Tech decisions (quick notes)

- No external UI component libraries — only simple reusable components + Tailwind utilities.
- Small in-memory HTTP cache + request de-duplication to reduce repeated API calls.
- Filters stored in the URL querystring so the state is shareable/bookmarkable.

## Getting started

```bash
npm install
npm run dev
```

The API base URL can be customized via `.env`:

```bash
VITE_API_BASE_URL=https://rickandmortyapi.com/api/
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment

Add your production URL here once deployed (Vercel, Netlify, etc.):

- Production: TODO

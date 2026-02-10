# Rick & Morty SPA — Frontend Technical Challenge

A Single Page Application built with **React + TypeScript + Vite** that consumes the public **Rick and Morty API** and provides a clean **Listing + Details** experience for **Characters**, **Episodes**, and **Locations**.

> **Production URL:** TODO (add link after deployment)  
> **API:** https://rickandmortyapi.com/

---

## What’s inside

### Listing (Home)
Browse items from the API with a fast, mobile-friendly UI:

- **Resources:** Characters / Episodes / Locations
- **Card layout:** each item shows **Title + Image**
  - Characters use the real image from the API
  - Episodes / Locations use a **placeholder image** (to keep the UI consistent)
- **Sorting:** by **Title** (A→Z / Z→A)
- **Filtering:**
  - **All resources:** title search
  - **Characters:** status + gender
  - **Episodes:** episode code (e.g. `S01`, `S01E05`)
  - **Locations:** type + dimension
- **Pagination:** Prev/Next (API-driven, uses the `page` param)
- **URL as source of truth:** filters, sort direction, resource and page live in the **querystring**, so the current view is:
  - shareable
  - bookmarkable
  - refresh-safe

### Details
A dedicated details page for any selected item:

- **Detail view** for characters / episodes / locations
- Displays the most relevant fields for the selected resource
- **Back navigation** keeps you in the same resource context
- **Related carousel:** the details page shows related entities (e.g. a character’s episodes), using the same card design as the home listing for a consistent UI

---

## Tech highlights (non-overkill)

- **No external UI component libraries**
  - The UI is built with small reusable components (Button / Input / Select / Card / etc.)
  - Styling uses **Tailwind utilities** + a lightweight “theme” approach
- **URL-driven state**
  - Search + filters + pagination are stored in the URL querystring
  - Improves UX and makes debugging / sharing easier
- **Rate-limit friendly**
  - Text inputs are **debounced** to reduce API calls while typing
  - Requests can be safely cancelled/avoided in fast navigation scenarios (depending on implementation)
- **Testing**
  - Component tests built with **React Testing Library** + **Vitest**
  - Focus on user-facing behavior: render states, interactions, and navigation

---

## Project structure (high level)

Typical organization:

- `src/features/rickmorty/` — domain logic (API calls, hooks, types, pages)
- `src/shared/ui/` — small reusable UI components (Button/Input/Select/etc.)
- `src/shared/lib/` — utilities (HTTP client, debounce, etc.)

---

## Getting started

### Requirements
- Node.js **18+** (recommended: **20.x**)
- npm

### Install & run
```bash
npm install
npm run dev


### Technical Questions:

1) What are Custom Hooks in React? Practical example + why useful
Custom Hooks are reusable functions that encapsulate React state + side effects so you can share logic across components without duplicating code or building complex wrappers.
Practical example (based on our app): useSearchParamsQuery()I used this hook to:
* Read filters/sort/page from the URL query string
* Provide set() helpers to update the URL
* Provide bindText() with debounce for text inputs
Why it’s useful
* Keeps components like ControlBar clean (mostly UI)
* Makes behavior consistent across components (same URL schema, same debounce rules)
* Easier to test (mock the hook and test UI behavior)

2) Advantages of TypeScript in Frontend + challenges integrating into an existing project
Advantages:
* Safer refactors: renaming fields or changing types is caught at compile time
* Better developer experience: autocompletion, inline docs, fewer runtime bugs
* Clear data types: APIs, component props, hooks return values become explicit.
* Scaling: large codebases and teams benefit from shared type language
Challenges in an existing JS project
* Initial migration cost: lots of any/unknown types until you gradually type things
* Third-party typings: some libs have weak types or require extra setup
* Build/tooling updates: TS config, ESLint rules, path aliases, test setup
* Culture shift: team needs alignment on “how strict” to be (e.g. noImplicitAny)
Good approach is incremental: start with “leaf” modules (utils, API clients), then components.

3) How to approach testing in a Frontend app + essential test types
I’d implement testing in layers, focusing on confidence per effort:
1. Unit tests (fast, they catch logic regressions cheaply)
* Pure functions: sorting, helpers
2. Component tests (RTL, verifies behavior without fragile implementation details)
* Render UI, assert what the user sees, interact with inputs/buttons
* Example: ControlBar shows correct filters per resource + updates query
3. Integration tests (catches wiring issues between hooks/components/router)
* A page flows through: fetch → loading → results → navigation
* Mock the API layer, test the composition
4. E2E tests (optional, highest confidence but highest maintenance cost)
* Cypress/Playwright for critical flows (search, open details)
For a technical challenge / SPA: unit + RTL component tests are the core, plus 1–2 integration tests if time.

4) Team distributed across time zones/cultures: strategies for communication & workflow
* Clear tickets and requirements: write straightforward tickets, decisions, and updates so nobody needs to be online simultaneously
* Clear ownership: “DRI” (directly responsible individual) per task to avoid ambiguity and know whom to ask.
* Documentation habit: short ADRs (Architecture Decision Records) for key decisions
* Dailies (Scrum methodology) even 30–60 minutes/day where everyone can sync live
* PR practices: small PRs, clear descriptions, screenshots, and checklists. So review them is easy.
* Cultural sensitivity: encourage asking for clarification, avoid assumptions, keep feedback specific and respectful

5) If someone proposes an inefficient/incorrect solution: how to handle it without tension
* Use my empathy and assume positive intent: “I see why that’s appealing, but…”
* Ask questions first: clarify goals/constraints. Helps you understand why the decision was taken.
* Use evidence, not opinion: benchmarks, small spike/prototype, API limits, complexity analysis.
* Offer alternatives: “What if we do X which keeps your idea but avoids Y risk?”
* Decide transparently and mutually: align on criteria (performance, maintainability, deadline), document the decision briefly.
* Keep it team-focused: frame as “best for the product”, not “who’s right”
* If needed, escalate calmly: bring it to a tech lead/architecture review with options and tradeoffs
This keeps trust intact while still steering toward the best technical outcome.

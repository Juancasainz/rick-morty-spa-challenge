import { expect, test } from "@playwright/test";

const API = "https://rickandmortyapi.com/api";

test("keeps filter, sort and pagination state after opening detail and going back", async ({ page }) => {
  await page.route(`${API}/character**`, async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === "/api/character/1") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
        }),
      });
      return;
    }

    if (url.pathname === "/api/character/1,2") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
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
        ]),
      });
      return;
    }

    if (url.pathname === "/api/character") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          info: {
            count: 1,
            pages: 2,
            next: `${API}/character?page=2`,
            prev: null,
          },
          results: [
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
          ],
        }),
      });
      return;
    }

    await route.fallback();
  });

  await page.route(`${API}/episode**`, async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === "/api/episode/1,2") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
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
            characters: [`${API}/character/1`],
            url: `${API}/episode/2`,
            created: "2017-11-10T12:56:33.916Z",
          },
        ]),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto("/?resource=characters&name=rick&status=alive&dir=desc&page=2");

  await expect(page.getByRole("heading", { name: /browse characters/i })).toBeVisible();
  await expect(page.getByLabel("Search")).toHaveValue("rick");
  await expect(page.getByLabel("Status")).toHaveValue("alive");
  await expect(page.getByLabel("Sort")).toHaveValue("desc");
  await expect(page.getByText("Page 2 / 2")).toBeVisible();

  await page.getByRole("link", { name: /open details for rick sanchez/i }).click();

  await expect(page.getByText(/characters details/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /back/i })).toBeVisible();

  await page.getByRole("button", { name: /back/i }).click();

  await expect(page).toHaveURL(/resource=characters/);
  await expect(page).toHaveURL(/name=rick/);
  await expect(page).toHaveURL(/status=alive/);
  await expect(page).toHaveURL(/dir=desc/);
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByLabel("Search")).toHaveValue("rick");
  await expect(page.getByLabel("Status")).toHaveValue("alive");
  await expect(page.getByLabel("Sort")).toHaveValue("desc");
});

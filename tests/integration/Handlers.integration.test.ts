import { describe, expect, it } from "vitest";

const API = "https://rickandmortyapi.com/api";

describe("MSW handlers integration", () => {
  it("filters episodes by name and code", async () => {
    const res = await fetch(`${API}/episode?name=pilot&episode=S01E01`);
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.results).toHaveLength(1);
    expect(data.results[0].name).toBe("Pilot");
    expect(data.results[0].episode).toBe("S01E01");
  });

  it("filters locations by type and dimension", async () => {
    const res = await fetch(`${API}/location?type=planet&dimension=C-137`);
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.results).toHaveLength(1);
    expect(data.results[0].name).toBe("Earth (C-137)");
  });

  it("returns 404 for unknown character id", async () => {
    const res = await fetch(`${API}/character/9999`);
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toBe("Not found");
  });

  it("returns array for multiple location ids", async () => {
    const res = await fetch(`${API}/location/1,3`);
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    expect(data[0].id).toBe(1);
    expect(data[1].id).toBe(3);
  });

  it("returns 404 for unknown location id", async () => {
    const res = await fetch(`${API}/location/9999`);
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.error).toBe("Not found");
  });
});

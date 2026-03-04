import { describe, it, expect } from "vitest";
import EpisodePlaceHolder from "@/shared/assets/EpisodePlaceHolder.png";
import LocationPlaceHolder from "@/shared/assets/LocationPlaceHolder.png";

import {
  isResourceType,
  isCharacter,
  isEpisode,
  isLocation,
  getItemImage,
  getItemSubtitle,
} from "@/features/rickmorty/shared/resourceConfig";

import type { Character, Episode, Location, Resource } from "@/features/rickmorty/model/types";

const character: Character = {
  id: 1,
  name: "Rick",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: { name: "Earth", url: "" },
  location: { name: "Earth", url: "" },
  image: "img.png",
  episode: ["https://rickandmortyapi.com/api/episode/1"],
  url: "",
  created: "",
};

const episode: Episode = {
  id: 1,
  name: "Pilot",
  air_date: "Dec 2, 2013",
  episode: "S01E01",
  characters: [],
  url: "",
  created: "",
};

const location: Location = {
  id: 1,
  name: "Citadel",
  type: "Space station",
  dimension: "Unknown",
  residents: [],
  url: "",
  created: "",
};

describe("resource utils", () => {
  it("isResourceType returns true only for valid resource strings", () => {
    expect(isResourceType("characters")).toBe(true);
    expect(isResourceType("episodes")).toBe(true);
    expect(isResourceType("locations")).toBe(true);

    expect(isResourceType("")).toBe(false);
    expect(isResourceType("character")).toBe(false);
    expect(isResourceType(undefined)).toBe(false);
  });

  it("isCharacter works only when resource=characters and item has character shape", () => {
    expect(isCharacter("characters", character as unknown as Resource)).toBe(true);
    expect(isCharacter("episodes", character as unknown as Resource)).toBe(false);
    expect(isCharacter("characters", episode as unknown as Resource)).toBe(false);
  });

  it("isEpisode works only when resource=episodes and item has episode shape", () => {
    expect(isEpisode("episodes", episode as unknown as Resource)).toBe(true);
    expect(isEpisode("characters", episode as unknown as Resource)).toBe(false);
    expect(isEpisode("episodes", location as unknown as Resource)).toBe(false);
  });

  it("isLocation works only when resource=locations and item has location shape", () => {
    expect(isLocation("locations", location as unknown as Resource)).toBe(true);
    expect(isLocation("episodes", location as unknown as Resource)).toBe(false);
    expect(isLocation("locations", character as unknown as Resource)).toBe(false);
  });

  it("getItemImage returns character image for characters", () => {
    expect(getItemImage("characters", character as unknown as Resource)).toBe("img.png");
  });

  it("getItemImage returns episode placeholder for episodes", () => {
    expect(getItemImage("episodes", episode as unknown as Resource)).toBe(EpisodePlaceHolder);
  });

  it("getItemImage returns location placeholder for locations (and fallback)", () => {
    expect(getItemImage("locations", location as unknown as Resource)).toBe(LocationPlaceHolder);

    // fallback branch: wrong shape for resource
    expect(getItemImage("locations", episode as unknown as Resource)).toBe(LocationPlaceHolder);
  });

  it("getItemSubtitle builds correct subtitles", () => {
    expect(getItemSubtitle("characters", character as unknown as Resource)).toBe("Alive • Human");
    expect(getItemSubtitle("episodes", episode as unknown as Resource)).toBe("S01E01 • Dec 2, 2013");
    expect(getItemSubtitle("locations", location as unknown as Resource)).toBe("Space station • Unknown");
  });

  it("getItemSubtitle uses Unknown fallbacks for empty location fields", () => {
    const loc2: Location = { ...location, type: "", dimension: "" };
    expect(getItemSubtitle("locations", loc2 as unknown as Resource)).toBe(
      "Unknown type • Unknown dimension"
    );
  });

  it("getItemSubtitle returns empty string on mismatch", () => {
    expect(getItemSubtitle("characters", episode as unknown as Resource)).toBe("");
  });
});
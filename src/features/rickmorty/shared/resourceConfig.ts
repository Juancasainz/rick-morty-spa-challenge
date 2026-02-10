import LocationPlaceHolder from "@/shared/assets/LocationPlaceHolder.png";
import EpisodePlaceHolder from "@/shared/assets/EpisodePlaceHolder.png";
import type { Character, Episode, Location, ResourceType } from "@/features/rickmorty/model/types";

export const RESOURCE_OPTIONS = ["characters", "episodes", "locations"] as const;

export function getItemImage(resource: ResourceType, item: any): string {
  switch (resource) {
    case "characters":
      return item.image;
    case "episodes":
      return EpisodePlaceHolder;
    case "locations":
      return LocationPlaceHolder;
    default:
      return "";
  }
}

export function getItemSubtitle(resource: ResourceType, item: any): string {
  switch (resource) {
    case "characters":
      return `${item.status} • ${item.species}`;
    case "episodes":
      return `${item.episode} • ${item.air_date}`;
    case "locations":
      return `${item.type || "Unknown type"} • ${item.dimension || "Unknown dimension"}`;
    default:
      return "";
  }
}

export function isResourceType(value: string | undefined): value is ResourceType {
  return !!value && (RESOURCE_OPTIONS as readonly string[]).includes(value);
}

export function isCharacter(resource: ResourceType, item: unknown): item is Character {
  return resource === "characters" && !!item && typeof item === "object" && "status" in item;
}

export function isEpisode(resource: ResourceType, item: unknown): item is Episode {
  return resource === "episodes" && !!item && typeof item === "object" && "episode" in item;
}

export function isLocation(resource: ResourceType, item: unknown): item is Location {
  return resource === "locations" && !!item && typeof item === "object" && "dimension" in item;
}

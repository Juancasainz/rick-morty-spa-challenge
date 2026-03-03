import LocationPlaceHolder from "@/shared/assets/LocationPlaceHolder.png";
import EpisodePlaceHolder from "@/shared/assets/EpisodePlaceHolder.png";
import type { Character, Episode, Location, Resource, ResourceType } from "@/features/rickmorty/model/types";

export const RESOURCE_OPTIONS = ["characters", "episodes", "locations"] as const;
export function getItemImage(
  resource: ResourceType,
  item: Resource
): string {
 if(isCharacter(resource, item)) {
    return (item as Character).image;
  }
  if(isEpisode(resource, item)) {
    return EpisodePlaceHolder;
  }
      return LocationPlaceHolder;
  }


export function getItemSubtitle(resource: ResourceType, item: Resource): string {
  if (isCharacter(resource, item)) {
    return `${item.status} • ${item.species}`;
  }
  if (isEpisode(resource, item)) {
    return `${item.episode} • ${item.air_date}`;
  }
  if (isLocation(resource, item)) {
    return `${item.type || "Unknown type"} • ${item.dimension || "Unknown dimension"}`;
  }
      return "";
  }

export function isResourceType(value: string | undefined): value is ResourceType {
  return !!value && (RESOURCE_OPTIONS as readonly string[]).includes(value);
}

export function isCharacter(resource: ResourceType, item: Resource): item is Character {
  return resource === "characters" && !!item && typeof item === "object" && "status" in item;
}

export function isEpisode(resource: ResourceType, item: Resource): item is Episode {
  return resource === "episodes" && !!item && typeof item === "object" && "episode" in item;
}

export function isLocation(resource: ResourceType, item: Resource): item is Location {
  return resource === "locations" && !!item && typeof item === "object" && "dimension" in item;
}

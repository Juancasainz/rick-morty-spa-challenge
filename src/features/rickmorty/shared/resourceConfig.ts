import LocationPlaceHolder from "@/shared/assets/LocationPlaceHolder.png";
import EpisodePlaceHolder from "@/shared/assets/EpisodePlaceHolder.png";
import type { ResourceType } from "@/features/rickmorty/model/types";

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

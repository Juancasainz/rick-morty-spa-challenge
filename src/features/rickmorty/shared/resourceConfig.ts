import placeholderImg from "@/shared/assets/placeholder.jpg";
import type { ResourceType } from "@/features/rickmorty/model/types";

export const RESOURCE_LABEL: Record<ResourceType, string> = {
  characters: "Characters",
  episodes: "Episodes",
  locations: "Locations",
};

export function getItemTitle(item: any): string {
  return item?.name ?? "";
}

export function getItemImage(resource: ResourceType, item: any): string {
  if (resource === "characters") return item.image as string;
  return placeholderImg;
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

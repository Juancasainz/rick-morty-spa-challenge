import { getJson } from "@/shared/lib/http/httpClient";
import type { ApiListResponse, ResourceMap, ResourceType } from "@/features/rickmorty/model/types";

const ENDPOINT_BY_RESOURCE: Record<ResourceType, string> = {
  characters: "character",
  episodes: "episode",
  locations: "location",
};

type CommonListParams = { page?: number; name?: string };

export type CharacterListParams = CommonListParams & {
  status?: string;
  gender?: string;
  species?: string;
};

export type EpisodeListParams = CommonListParams & {
  episode?: string; // e.g. "S01"
};

export type LocationListParams = CommonListParams & {
  type?: string;
  dimension?: string;
};

export type ListParamsByResource = {
  characters: CharacterListParams;
  episodes: EpisodeListParams;
  locations: LocationListParams;
};

export async function fetchResourceList<R extends ResourceType>(
  resource: R,
  params: ListParamsByResource[R]
): Promise<ApiListResponse<ResourceMap[R]>> {
  return await getJson<ApiListResponse<ResourceMap[R]>>(
    `/${ENDPOINT_BY_RESOURCE[resource]}`,
    { query: params }
  );
}

export async function fetchResourceById<R extends ResourceType>(
  resource: R,
  id: string | number
): Promise<ResourceMap[R]> {
  return await getJson<ResourceMap[R]>(`/${ENDPOINT_BY_RESOURCE[resource]}/${id}`);
}

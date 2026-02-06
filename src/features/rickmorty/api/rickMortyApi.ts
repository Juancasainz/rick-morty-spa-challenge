import { getJson } from "@/shared/lib/http/httpClient";
import type { ResourceMap, ResourceType } from "@/features/rickmorty/model/types";

export type ApiInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

export type ApiListResponse<T> = {
  info: ApiInfo;
  results: T[];
};

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
  episode?: string;
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

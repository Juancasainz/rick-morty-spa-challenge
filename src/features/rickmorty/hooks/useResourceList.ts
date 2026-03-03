import { useMemo } from "react";
import { useAsync } from "@/shared/lib/hooks/useAsync";
import type { ResourceMap, ResourceType } from "@/features/rickmorty/model/types";
import { fetchResourceList, type ListParamsByResource, type ApiListResponse } from "@/features/rickmorty/api/rickMortyApi";

export type SortDir = "asc" | "desc";

function compareStrings(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function useResourceList<R extends ResourceType>(
  resource: R,
  params: ListParamsByResource[R],
  dir: SortDir = "asc"
) {
  const { data, isLoading, error } = useAsync<ApiListResponse<ResourceMap[R]>>(
    () => fetchResourceList(resource, params),
    [resource, JSON.stringify(params)]
  );

  const sorted = useMemo(() => {
    const results = data?.results ?? [];

    const copy = [...results];
    copy.sort((x, y) => {
      const c = compareStrings(x.name, y.name);
      return dir === "asc" ? c : -c;
    });
    return copy;
  }, [data, dir]);

  return {
    info: data?.info,
    items: sorted,
    isLoading,
    error,
  };
}

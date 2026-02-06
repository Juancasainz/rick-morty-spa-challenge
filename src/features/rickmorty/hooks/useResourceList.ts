import { useMemo } from "react";
import { useAsync } from "@/shared/lib/hooks/useAsync";
import type { ApiListResponse, ResourceMap, ResourceType } from "@/features/rickmorty/model/types";
import { fetchResourceList, type ListParamsByResource } from "@/features/rickmorty/api/rickMortyApi";

export type SortDir = "asc" | "desc";

function compareStrings(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function useResourceList<R extends ResourceType>(
  resource: R,
  params: ListParamsByResource[R],
  sortBy: "title" = "title",
  dir: SortDir = "asc"
) {
  const { data, isLoading, error } = useAsync<ApiListResponse<ResourceMap[R]>>(
    () => fetchResourceList(resource, params),
    [resource, JSON.stringify(params)]
  );

  const sorted = useMemo(() => {
    const results = data?.results ?? [];
    if (sortBy !== "title") return results;

    const copy = [...results];
    copy.sort((x, y) => {
      // All resources have name
      const a = (x as any).name as string;
      const b = (y as any).name as string;
      const c = compareStrings(a, b);
      return dir === "asc" ? c : -c;
    });
    return copy;
  }, [data, sortBy, dir]);

  return {
    info: data?.info,
    items: sorted,
    isLoading,
    error,
  };
}

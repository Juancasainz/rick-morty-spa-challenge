import { useAsync } from "@/shared/lib/hooks/useAsync";
import { fetchResourceMany } from "@/features/rickmorty/api/rickMortyApi";
import type { ResourceType } from "@/features/rickmorty/model/types";

export function idsFromUrls(urls: unknown): string[] {
  if (!Array.isArray(urls)) return [];

  return urls
    .map((u) => (typeof u === "string" ? u.split("/").pop() : null))
    .filter(Boolean) as string[];
}

export function useRelatedItems(resource: ResourceType, item: any, limit: number) {
  const { relatedResource, ids } = (() => {
    if (resource === "characters") return { relatedResource: "episodes" as const, ids: idsFromUrls(item?.episode) };
    if (resource === "episodes") return { relatedResource: "characters" as const, ids: idsFromUrls(item?.characters) };
    return { relatedResource: "characters" as const, ids: idsFromUrls(item?.residents) };
  })();

  const wanted = ids.slice(0, limit);

  const { data, isLoading, error } = useAsync<any[]>(
    async () => {
      if (!wanted.length) return [];
      return fetchResourceMany(relatedResource, wanted);
    },
    [relatedResource, wanted.join(",")]
  );

  return {
    relatedResource,
    relatedItems: data ?? [],
    isLoading,
    error,
    total: ids.length,
    loaded: wanted.length,
  };
}

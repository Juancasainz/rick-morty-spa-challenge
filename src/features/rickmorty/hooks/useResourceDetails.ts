import { useAsync } from "@/shared/lib/hooks/useAsync";
import type { ResourceMap, ResourceType } from "@/features/rickmorty/model/types";
import { fetchResourceById } from "@/features/rickmorty/api/rickMortyApi";

export function useResourceDetails<R extends ResourceType>(resource: R, id: string | undefined) {
  const { data, isLoading, error } = useAsync<ResourceMap[R] | null>(
    async () => {
      if (!id) return null;
      return await fetchResourceById(resource, id);
    },
    [resource, id]
  );

  return { item: data, isLoading, error };
}

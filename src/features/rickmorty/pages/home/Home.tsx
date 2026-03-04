import React from "react";
import { useResourceList } from "@/features/rickmorty/hooks/useResourceList";
import { ItemCard } from "@/features/rickmorty/shared/ItemCard";
import { Spinner } from "@/shared/ui";
import { ControlBar } from "./components/ControlBar";
import { useSearchParamsQuery } from "@/features/rickmorty/shared/useSearchParamsQuery.ts";
import type { Filter } from "../../model/types";

export const RickMortyHomePage: React.FC = () => {
  const q = useSearchParamsQuery();
  const { items, info, isLoading, error } = useResourceList(q.resource, q.params as Filter, q.dir);
  const cards = React.useMemo(
    () =>
      items.map((item) => (
        <ItemCard key={`${q.resource}-${item.id}`} resource={q.resource} item={item} />
      )),
    [items, q.resource]
  );

  return (
    <div className="space-y-4">
      <ControlBar pages={info?.pages} />

      { isLoading && <Spinner /> }

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm">
          <p className="font-semibold">Couldn’t load results.</p>
          <p className="text-black/70 mt-1">Try changing filters or resource.</p>
        </div>
      )}

      {!isLoading && !error && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards}
        </section>
      )}
    </div>
  );
};

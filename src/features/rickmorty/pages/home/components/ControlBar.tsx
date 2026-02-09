import React from "react";
import { Button } from "@/shared/ui/Button";
import type { ResourceType } from "@/features/rickmorty/model/types";
import { useSearchParamsQuery } from "@/features/rickmorty/shared/useSearchParamsQuery.ts";
import { Pagination } from "./Pagination";

const RESOURCES: ResourceType[] = ["characters", "episodes", "locations"];

export const ControlBar: React.FC<{ pages?: number }> = ({ pages }) => {
  const q = useSearchParamsQuery();

  const clear = () =>
    q.set({ name: undefined, status: undefined, gender: undefined, episode: undefined, type: undefined, dimension: undefined });

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Browse {q.resource}</h2>
          <p className="text-sm text-black/70">Rick and Morty API explorer (list + details).</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {RESOURCES.map((r) => (
            <Button
              key={r}
              variant={r === q.resource ? "primary" : "secondary"}
              onClick={() => q.set({ resource: r, status: undefined, gender: undefined, episode: undefined, type: undefined, dimension: undefined })}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="text-sm font-medium">Search</label>
          <input
            {...q.bindText("name")}
            placeholder="Type a name..."
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
          />
        </div>

        {q.resource === "characters" && (
          <>
            <div className="md:col-span-3">
              <label className="text-sm font-medium">Status</label>
              <select
                value={q.status}
                onChange={(e) => q.set({ status: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm bg-white"
              >
                <option value="">Any</option>
                <option value="alive">Alive</option>
                <option value="dead">Dead</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-medium">Gender</label>
              <select
                value={q.gender}
                onChange={(e) => q.set({ gender: e.target.value })}
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm bg-white"
              >
                <option value="">Any</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="genderless">Genderless</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </>
        )}

        {q.resource === "episodes" && (
          <div className="md:col-span-6">
            <label className="text-sm font-medium">Episode</label>
            <input
              {...q.bindText("episode")}
              placeholder="e.g. S01 or S01E05"
              className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
            />
          </div>
        )}

        {q.resource === "locations" && (
          <>
            <div className="md:col-span-3">
              <label className="text-sm font-medium">Type</label>
              <input
                {...q.bindText("type")}
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm font-medium">Dimension</label>
              <input
                {...q.bindText("dimension")}
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Sort</label>
          <select
            value={q.dir}
            onChange={(e) => q.set({ dir: e.target.value })}
            className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm bg-white"
          >
            <option value="asc">Title ↑</option>
            <option value="desc">Title ↓</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={clear}>Clear filters</Button>
        <Pagination page={q.page} pages={pages} />
      </div>
    </section>
  );
};

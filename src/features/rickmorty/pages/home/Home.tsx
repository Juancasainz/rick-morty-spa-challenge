import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ResourceType } from "@/features/rickmorty/model/types";
import { useResourceList, type SortDir } from "@/features/rickmorty/hooks/useResourceList";
import { ItemCard } from "@/features/rickmorty/shared/ItemCard";
import { RESOURCE_LABEL } from "@/features/rickmorty/shared/resourceConfig";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/ui/Spinner";

const RESOURCE_OPTIONS: ResourceType[] = ["characters", "episodes", "locations"];
const DIR_OPTIONS: SortDir[] = ["asc", "desc"];

function getParam(sp: URLSearchParams, key: string, fallback: string) {
  return sp.get(key) ?? fallback;
}
function setParam(sp: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(sp);
  if (!value) next.delete(key);
  else next.set(key, value);
  return next;
}

export const RickMortyHomePage: React.FC = () => {
  const [sp, setSp] = useSearchParams();

  const resource = (getParam(sp, "resource", "characters") as ResourceType);
  const safeResource: ResourceType = RESOURCE_OPTIONS.includes(resource) ? resource : "characters";

  const dir = (getParam(sp, "dir", "asc") as SortDir);
  const safeDir: SortDir = DIR_OPTIONS.includes(dir) ? dir : "asc";

  const page = Number(getParam(sp, "page", "1"));
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const name = getParam(sp, "name", "");
  const status = getParam(sp, "status", "");
  const gender = getParam(sp, "gender", "");
  const episode = getParam(sp, "episode", "");
  const type = getParam(sp, "type", "");
  const dimension = getParam(sp, "dimension", "");

  const params = useMemo(() => {
    if (safeResource === "characters") {
      return { page: safePage, name, status: status || undefined, gender: gender || undefined };
    }
    if (safeResource === "episodes") {
      return { page: safePage, name, episode: episode || undefined };
    }
    return { page: safePage, name, type: type || undefined, dimension: dimension || undefined };
  }, [safeResource, safePage, name, status, gender, episode, type, dimension]);

  const { items, info, isLoading, error } = useResourceList(safeResource, params as any, "name", safeDir);

  const canPrev = safePage > 1;
  const canNext = info ? safePage < info.pages : false;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-black/10 bg-white p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Browse {RESOURCE_LABEL[safeResource]}</h2>
            <p className="text-sm text-black/70">Rick and Morty API explorer (list + details).</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {RESOURCE_OPTIONS.map((r) => (
              <Button
                key={r}
                variant={r === safeResource ? "primary" : "secondary"}
                onClick={() => setSp((prev) => setParam(prev, "resource", r))}
              >
                {RESOURCE_LABEL[r]}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className="text-sm font-medium">Search by title</label>
            <input
              value={name}
              onChange={(e) => setSp((prev) => setParam(setParam(prev, "page", "1"), "name", e.target.value))}
              placeholder="Type a name..."
              className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
            />
          </div>

          {safeResource === "characters" && (
            <>
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setSp((prev) => setParam(setParam(prev, "page", "1"), "status", e.target.value))}
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
                  value={gender}
                  onChange={(e) => setSp((prev) => setParam(setParam(prev, "page", "1"), "gender", e.target.value))}
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

          {safeResource === "episodes" && (
            <div className="md:col-span-3">
              <label className="text-sm font-medium">Episode code</label>
              <input
                value={episode}
                onChange={(e) => setSp((prev) => setParam(setParam(prev, "page", "1"), "episode", e.target.value))}
                placeholder="e.g. S01 or S01E05"
                className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
              />
            </div>
          )}

          {safeResource === "locations" && (
            <>
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Type</label>
                <input
                  value={type}
                  onChange={(e) => setSp((prev) => setParam(setParam(prev, "page", "1"), "type", e.target.value))}
                  placeholder="e.g. Planet"
                  className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Dimension</label>
                <input
                  value={dimension}
                  onChange={(e) => setSp((prev) => setParam(setParam(prev, "page", "1"), "dimension", e.target.value))}
                  placeholder="e.g. C-137"
                  className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Sort</label>
            <select
              value={safeDir}
              onChange={(e) => setSp((prev) => setParam(prev, "dir", e.target.value))}
              className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm bg-white"
            >
              <option value="asc">Title ↑</option>
              <option value="desc">Title ↓</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const keysToClear = ["name", "status", "gender", "episode", "type", "dimension"];
              setSp((prev) => {
                let next = new URLSearchParams(prev);
                for (const k of keysToClear) next.delete(k);
                next.set("page", "1");
                return next;
              });
            }}
          >
            Clear filters
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button disabled={!canPrev} onClick={() => setSp((prev) => setParam(prev, "page", String(safePage - 1)))}>
              Prev
            </Button>
            <span className="text-sm text-black/70">Page {safePage}{info ? ` / ${info.pages}` : ""}</span>
            <Button disabled={!canNext} onClick={() => setSp((prev) => setParam(prev, "page", String(safePage + 1)))}>
              Next
            </Button>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm">
          <p className="font-semibold">Couldn’t load results.</p>
          <p className="text-black/70 mt-1">Try changing filters or resource.</p>
        </div>
      )}

      {!isLoading && !error && (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <ItemCard key={(it as any).id} resource={safeResource} item={it as any} />
          ))}
        </section>
      )}
    </div>
  );
};

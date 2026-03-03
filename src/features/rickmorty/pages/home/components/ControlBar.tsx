import React from "react";
import type { CharacterGender, CharacterStatus, ResourceType } from "@/features/rickmorty/model/types";
import { useSearchParamsQuery } from "@/features/rickmorty/shared/useSearchParamsQuery.ts";
import { Pagination } from "./Pagination";
import { Button, Input, Select } from "@/shared/ui";

export type ControlBarFormValues = {
  resource: ResourceType;
  name: string;
  dir: "asc" | "desc";
  status: CharacterStatus | "";
  gender: CharacterGender | "";
  episode: string;
  type: string;
  dimension: string;
  page?: number;
};

const RESOURCES: ResourceType[] = ["characters", "episodes", "locations"];

const STATUS_OPTIONS = {
  alive: "Alive",
  dead: "Dead",
  unknown: "Unknown",
} as const;

const GENDER_OPTIONS = {
  female: "Female",
  male: "Male",
  genderless: "Genderless",
  unknown: "Unknown",
} as const;

const SORT_OPTIONS = {
  asc: "Title ↑",
  desc: "Title ↓",
} as const;

const RESET_FILTERS_PATCH = {
  name: undefined,
  status: undefined,
  gender: undefined,
  episode: undefined,
  type: undefined,
  dimension: undefined,
} as const;

const RESET_RESOURCE_SPECIFIC_PATCH = {
  status: undefined,
  gender: undefined,
  episode: undefined,
  type: undefined,
  dimension: undefined,
} as const;

export const ControlBar: React.FC<{ pages?: number }> = ({ pages }) => {
  const q = useSearchParamsQuery();

  const clear = () => q.set(RESET_FILTERS_PATCH);

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
              onClick={() => q.set({ resource: r, ...RESET_RESOURCE_SPECIFIC_PATCH })}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <Input
            {...q.bindText("name")}
            id="search"
            title={'Search'}
            placeholder="Type a name..."
          />
        </div>

        {q.resource === "characters" && (
          <>
            <div className="md:col-span-3">
              <Select
                id="status"
                title="Status"
                value={q.status}
                placeholder="Any"
                options={STATUS_OPTIONS}
                onChange={(v) => q.set({ status: v })}
              />
            </div>

            <div className="md:col-span-3">
              <Select
                id="gender"
                title="Gender"
                value={q.gender}
                placeholder="Any"
                options={GENDER_OPTIONS}
                onChange={(v) => q.set({ gender: v })}
              />
            </div>
          </>
        )}

        {q.resource === "episodes" && (
          <div className="md:col-span-6">
            <Input
              {...q.bindText("episode")}
              id="episode"
              title={'Episode:'}
              placeholder="e.g. S01 or S01E05"
            />
          </div>
        )}

        {q.resource === "locations" && (
          <>
            <div className="md:col-span-3">
              <Input
                {...q.bindText("type")}
                id="type"
                title={'Type'}
              />
            </div>
            <div className="md:col-span-3">
              <Input
                {...q.bindText("dimension")}
                id="dimension"
                title={'Dimension'}
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <Select
            id="dir"
            title="Sort"
            value={q.dir}
            options={SORT_OPTIONS}
            onChange={(v) => q.set({ dir: v })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button className="w-full sm:w-auto" onClick={clear}>
          Clear filters
        </Button>

        <div className="sm:ml-auto">
          <Pagination page={q.page} pages={pages} />
        </div>
      </div>
    </section>
  );
};

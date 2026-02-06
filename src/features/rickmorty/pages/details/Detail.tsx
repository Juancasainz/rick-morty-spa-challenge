import React from "react";
import { Link, useParams } from "react-router-dom";
import type { ResourceType } from "@/features/rickmorty/model/types";
import { useResourceDetails } from "@/features/rickmorty/hooks/useResourceDetails";
import { getItemImage } from "@/features/rickmorty/shared/resourceConfig";
import { Image } from "@/shared/ui/Image";
import { Spinner } from "@/shared/ui/Spinner";
import { Button } from "@/shared/ui/Button";

const RESOURCE_OPTIONS: ResourceType[] = ["characters", "episodes", "locations"];

function isResourceType(value: string | undefined): value is ResourceType {
  return !!value && (RESOURCE_OPTIONS as readonly string[]).includes(value);
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 p-3">
      <div className="text-xs uppercase tracking-wide text-black/50">{label}</div>
      <div className="mt-1 text-sm">{value || <span className="text-black/50">—</span>}</div>
    </div>
  );
}

export const RickMortyDetailPage: React.FC = () => {
  const params = useParams();
  const resource = isResourceType(params.resource) ? params.resource : "characters";
  const id = params.id;

  const { item, isLoading, error } = useResourceDetails(resource, id);
  const imageSrc = item ? getItemImage(resource, item) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to={`/?resource=${resource}`}>
          <Button>← Back</Button>
        </Link>
        <span className="text-sm text-black/60">{resource} details</span>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm">
          <p className="font-semibold">Couldn’t load details.</p>
          <p className="text-black/70 mt-1">The item may not exist.</p>
        </div>
      )}

      {item && (
        <section className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
              <div className="aspect-[4/3] bg-black/5">
                <Image src={imageSrc} alt={item?.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item?.name}</h2>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 grid gap-3 sm:grid-cols-2">
            {resource === "characters" && (
              <>
                <Field label="Status" value={(item as any).status} />
                <Field label="Species" value={(item as any).species} />
                <Field label="Gender" value={(item as any).gender} />
                <Field label="Origin" value={(item as any).origin?.name} />
                <Field label="Last known location" value={(item as any).location?.name} />
                <Field label="Episodes" value={(item as any).episode?.length} />
              </>
            )}

            {resource === "episodes" && (
              <>
                <Field label="Code" value={(item as any).episode} />
                <Field label="Air date" value={(item as any).air_date} />
                <Field label="Characters" value={(item as any).characters?.length} />
              </>
            )}

            {resource === "locations" && (
              <>
                <Field label="Type" value={(item as any).type} />
                <Field label="Dimension" value={(item as any).dimension} />
                <Field label="Residents" value={(item as any).residents?.length} />
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

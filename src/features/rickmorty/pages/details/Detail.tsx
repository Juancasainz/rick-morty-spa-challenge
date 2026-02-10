import React from "react";
import { Link, useParams } from "react-router-dom";
import { useResourceDetails } from "@/features/rickmorty/hooks/useResourceDetails";
import { getItemImage, isCharacter, isEpisode, isLocation, isResourceType } from "@/features/rickmorty/shared/resourceConfig";
import { Button, Field, Image, Spinner } from "@/shared/ui";
import { RelatedCarousel } from "./components/RelatedCarousel";

export const RickMortyDetailPage: React.FC = () => {
  const params = useParams();
  const resource = isResourceType(params.resource) ? params.resource : "characters";
  const id = params.id ?? "";

  const { item, isLoading, error } = useResourceDetails(resource, id);
  const imageSrc = item ? getItemImage(resource, item) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to={`/?resource=${resource}`}>
          <Button>← Back</Button>
        </Link>
        <span className="text-sm ">{resource} details</span>
      </div>

      {isLoading && <Spinner />}

      {error && (
        <div className="p-4 text-sm" style={{ borderColor: "rgba(255,102,156,0.35)" }}>
          <p className="font-semibold">Couldn’t load details.</p>
          <p className="mt-1">The item may not exist.</p>
        </div>
      )}

      {item && (
        <section className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
              <Image src={imageSrc} alt={item.name} className="w-full h-full object-cover aspect-[4/3] bg-black/5" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.name}</h2>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 grid gap-3 sm:grid-cols-2">
            {isCharacter(resource, item) && (
              <>
                <Field label="Status" value={item.status} />
                <Field label="Species" value={item.species} />
                <Field label="Gender" value={item.gender} />
                <Field label="Origin" value={item.origin?.name} />
                <Field label="Last known location" value={item.location?.name} />
              </>
            )}

            {isEpisode(resource, item) && (
              <>
                <Field label="Code" value={item.episode} />
                <Field label="Air date" value={item.air_date} />
              </>
            )}

            {isLocation(resource, item) && (
              <>
                <Field label="Type" value={item.type} />
                <Field label="Dimension" value={item.dimension} />
              </>
            )}
          </div>
        </section>
      )}
      <RelatedCarousel resource={resource} item={item} />
    </div>
  );
};

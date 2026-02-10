import React from "react";
import { Link } from "react-router-dom";
import type { Resource, ResourceType } from "@/features/rickmorty/model/types";
import { getItemImage, getItemSubtitle } from "@/features/rickmorty/shared/resourceConfig";
import { Image } from "@/shared/ui";

type Props = {
  resource: ResourceType;
  item: Resource;
};

export const ItemCard: React.FC<Props> = ({ resource, item }) => {
  const subtitle = getItemSubtitle(resource, item);
  const imageSrc = getItemImage(resource, item);

  return (
    <Link
      to={`/${resource}/${item.id}`}
      className="block rounded-2xl border border-black/10 bg-white overflow-hidden hover:shadow-sm transition"
      aria-label={`Open details for ${item.name}`}
    >
      <div className="aspect-[4/3] bg-black/5">
        <Image src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-3">
        <h3 className="font-semibold leading-tight line-clamp-1">{item?.name}</h3>
        <p className="text-sm text-black/70 line-clamp-1 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
};

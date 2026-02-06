import React from "react";
import { Link } from "react-router-dom";
import type { ResourceType } from "@/features/rickmorty/model/types";
import { getItemImage, getItemSubtitle, getItemTitle } from "@/features/rickmorty/shared/resourceConfig";
import { Image } from "@/shared/ui/Image";

type Props = {
  resource: ResourceType;
  item: { id: number } & Record<string, unknown>;
};

export const ItemCard: React.FC<Props> = ({ resource, item }) => {
  const title = getItemTitle(item);
  const subtitle = getItemSubtitle(resource, item);
  const imageSrc = getItemImage(resource, item);

  return (
    <Link
      to={`/${resource}/${item.id}`}
      className="block rounded-2xl border border-black/10 bg-white overflow-hidden hover:shadow-sm transition"
      aria-label={`Open details for ${title}`}
    >
      <div className="aspect-[4/3] bg-black/5">
        <Image src={imageSrc} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="p-3">
        <h3 className="font-semibold leading-tight line-clamp-1">{title}</h3>
        <p className="text-sm text-black/70 line-clamp-1 mt-1">{subtitle}</p>
      </div>
    </Link>
  );
};

import React from "react";
import { ItemCard } from "@/features/rickmorty/shared/ItemCard";
import { useRelatedItems } from "@/features/rickmorty/hooks/useRelatedItems";
import { Spinner } from "@/shared/ui/Spinner";

const STEP = 8;

export function RelatedCarousel({ resource, item }: { resource: any; item: any }) {
    const [limit, setLimit] = React.useState(STEP);
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);

    // Reset when main item changes
    React.useEffect(() => {
        setLimit(STEP);
    }, [resource, item?.id]);

    const { relatedResource, relatedItems, isLoading, total, loaded } = useRelatedItems(resource, item, limit);

    if (!item || total === 0) return null;

    const onScroll = () => {
        const el = scrollerRef.current;
        if (!el) return;

        const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 120; // 120px threshold
        const canLoadMore = loaded < total;

        if (nearEnd && canLoadMore && !isLoading) {
            setLimit((l) => Math.min(total, l + STEP));
        }
    };

    return (
        <section className="mt-6">
            <div className="flex items-end justify-between mb-2">
                <h3 className="text-base font-semibold">
                    Related {relatedResource} ({total})
                </h3>
                <p className="text-sm text-black/60">
                    {loaded < total ? `Showing ${loaded} — scroll for more →` : "All loaded"}
                </p>
            </div>

            <div
                ref={scrollerRef}
                onScroll={onScroll}
                className="flex gap-3 overflow-x-auto pb-2"
            >
                {relatedItems.map((it: any) => (
                    <div key={`${relatedResource}-${it.id}`} className="min-w-[240px]">
                        <ItemCard resource={relatedResource} item={it} />
                    </div>
                ))}

                { isLoading && <Spinner /> }
            </div>
        </section>
    );
}

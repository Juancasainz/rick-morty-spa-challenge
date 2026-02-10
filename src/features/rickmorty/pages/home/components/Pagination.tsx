import React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/shared/ui";

type Props = { page: number; pages?: number };

export const Pagination: React.FC<Props> = ({ page, pages }) => {
  const [sp, setSp] = useSearchParams();
  const [locked, setLocked] = React.useState(false);

  const setPage = (nextPage: number) => {
    if (locked) return;
    setLocked(true);

    const p = Math.max(1, nextPage);
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);

    window.setTimeout(() => setLocked(false), 300);
  };

  const canPrev = page > 1;
  const canNext = pages ? page < pages : false;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button disabled={!canPrev || locked} onClick={() => setPage(page - 1)}>
        Prev
      </Button>
      <span className="text-sm text-black/70">
        Page {page}{pages ? ` / ${pages}` : ""}
      </span>
      <Button disabled={!canNext || locked} onClick={() => setPage(page + 1)}>
        Next
      </Button>
    </div>
  );
};

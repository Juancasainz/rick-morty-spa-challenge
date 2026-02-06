import React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/shared/ui/Button";

type Props = { page: number; pages?: number };

export const Pagination: React.FC<Props> = ({ page, pages }) => {
  const [sp, setSp] = useSearchParams();

  const setPage = (nextPage: number) => {
    const p = Math.max(1, nextPage);
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    setSp(next);
  };

  const canPrev = page > 1;
  const canNext = pages ? page < pages : false;

  return (
    <div className="ml-auto flex items-center gap-2">
      <Button disabled={!canPrev} onClick={() => setPage(page - 1)}>
        Prev
      </Button>

      <span className="text-sm text-black/70">
        Page {page}
        {pages ? ` / ${pages}` : ""}
      </span>

      <Button disabled={!canNext} onClick={() => setPage(page + 1)}>
        Next
      </Button>
    </div>
  );
};

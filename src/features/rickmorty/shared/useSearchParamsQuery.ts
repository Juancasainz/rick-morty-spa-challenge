import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { ResourceType } from "@/features/rickmorty/model/types";

type SortDir = "asc" | "desc";

export function useSearchParamsQuery() {
  const [sp, setSp] = useSearchParams();

  const resource = (sp.get("resource") as ResourceType) || "characters";
  const dir: SortDir = sp.get("dir") === "desc" ? "desc" : "asc";
  const page = Number(sp.get("page") || 1) || 1;

  const name = sp.get("name") || "";
  const status = sp.get("status") || "";
  const gender = sp.get("gender") || "";
  const episode = sp.get("episode") || "";
  const type = sp.get("type") || "";
  const dimension = sp.get("dimension") || "";
  const liveTextValues = { name, episode, type, dimension } as const;

  const timers = useRef<Record<string, number>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({
    name,
    episode,
    type,
    dimension,
  });

  useEffect(() => {
    const timersAtUnmount = timers.current;
    return () => {
      Object.values(timersAtUnmount).forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const set = useCallback(
    (patch: Record<string, string | undefined>, resetPage = true) => {
      setSp((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        if (resetPage) next.set("page", "1");
        return next;
      });

      setDrafts((d) => ({
        ...Object.fromEntries(Object.entries(d).filter(([k]) => !(k in patch))),
      }));
    },
    [setSp]
  );

    const bindText = (key: "name" | "episode" | "type" | "dimension", delayMs = 300) => ({
    value: drafts[key] ?? liveTextValues[key],
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setDrafts((d) => ({ ...d, [key]: v }));
      setDebounced({ [key]: v }, delayMs);
    },
  });
  const setDebounced = (patch: Record<string, string | undefined>, delayMs = 300, resetPage = true) => {
    Object.entries(patch).forEach(([key, value]) => {
      window.clearTimeout(timers.current[key]);
      timers.current[key] = window.setTimeout(() => {
        set({ [key]: value }, resetPage);
      }, delayMs);
    });
  };

  const params = useMemo(() => {
    const base = { page, name };
    if (resource === "characters") return { ...base, status: status || undefined, gender: gender || undefined };
    if (resource === "episodes") return { ...base, episode: episode || undefined };
    return { ...base, type: type || undefined, dimension: dimension || undefined };
  }, [resource, page, name, status, gender, episode, type, dimension]);

  return {
    resource, dir, page,
    name, status, gender, episode, type, dimension,
    params,
    set,
    setDebounced,
    bindText,
  };
}

import { useEffect, useMemo, useRef, useState } from "react";
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

  const set = (patch: Record<string, string | undefined>, resetPage = true) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (resetPage) next.set("page", "1");
    setSp(next);
  };

  const timers = useRef<Record<string, number>>({});
  const setDebounced = (patch: Record<string, string | undefined>, delayMs = 300, resetPage = true) => {
    Object.entries(patch).forEach(([key, value]) => {
      window.clearTimeout(timers.current[key]);
      timers.current[key] = window.setTimeout(() => {
        set({ [key]: value }, resetPage);
      }, delayMs);
    });
  };

  // ✅ local drafts for text inputs (so typing feels normal)
  const [drafts, setDrafts] = useState<Record<string, string>>({
    name,
    episode,
    type,
    dimension,
  });

  // keep drafts in sync when URL changes externally (back/forward, clear, etc.)
  useEffect(() => {
    setDrafts((d) => ({
      ...d,
      name,
      episode,
      type,
      dimension,
    }));
  }, [name, episode, type, dimension]);

  const bindText = (key: "name" | "episode" | "type" | "dimension", delayMs = 300) => {
    return {
      value: drafts[key] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setDrafts((d) => ({ ...d, [key]: v }));          // immediate UI update
        setDebounced({ [key]: v }, delayMs, true);       // debounced URL update
      },
    };
  };

  const params = useMemo(() => {
    const base: any = { page, name };
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

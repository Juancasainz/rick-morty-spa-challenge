import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ResourceType } from "@/features/rickmorty/model/types";

export type SortDir = "asc" | "desc";

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

  const params = useMemo(() => {
    const base: any = { page, name };
    if (resource === "characters") return { ...base, status, gender };
    if (resource === "episodes") return { ...base, episode };
    return { ...base, type, dimension };
  }, [resource, page, name, status, gender, episode, type, dimension]);

  const set = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setSp(next);
  };

  return { resource, dir, page, name, status, gender, episode, type, dimension, params, set };
}

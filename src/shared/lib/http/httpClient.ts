import { env } from "@/shared/config/env";

type Query = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, query?: Query) {
  const base = env.API_BASE_URL.endsWith("/") ? env.API_BASE_URL : `${env.API_BASE_URL}/`;
  const cleanPath = path.replace(/^\/+/, "");
  const url = new URL(cleanPath, base);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

// ---- CACHE (in-memory) ----
type CacheEntry = { expiresAt: number; data: unknown };
const responseCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();

const DEFAULT_TTL_MS = 500_000;

export function __clearHttpCacheForTests() {
  responseCache.clear();
  inFlight.clear();
}

export async function getJson<T>(
  path: string,
  opts?: { query?: Query; signal?: AbortSignal; cacheTtlMs?: number }
): Promise<T> {
  const url = buildUrl(path, opts?.query);
  const now = Date.now();

  const ttl = opts?.cacheTtlMs ?? DEFAULT_TTL_MS;

  // 1) Cache hit
  const cached = responseCache.get(url);
  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  // 2) Dedup: si ya hay request en vuelo para esta URL, re-usa la misma Promise
  const pending = inFlight.get(url);
  if (pending) return (await pending) as T;

  // 3) Request real
  const promise = fetch(url, {
    headers: { Accept: "application/json" },
    signal: opts?.signal,
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
      const data = (await res.json()) as T;
      responseCache.set(url, { data, expiresAt: now + ttl });
      return data;
    })
    .finally(() => {
      inFlight.delete(url);
    });

  inFlight.set(url, promise as Promise<unknown>);
  return await promise;
}

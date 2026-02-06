const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const env = {
  API_BASE_URL: API_BASE_URL ?? "https://rickandmortyapi.com/api",
} as const;

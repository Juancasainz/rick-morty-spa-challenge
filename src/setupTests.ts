import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../tests/mocks/server";
import { __clearHttpCacheForTests } from "@/shared/lib/http/httpClient";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  __clearHttpCacheForTests();
});
afterAll(() => server.close());

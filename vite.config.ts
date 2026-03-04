import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
  environment: "jsdom",
  globals: true,
  setupFiles: './src/setupTests.ts',
  coverage: {
    provider: "v8", 
    reporter: ["text", "html", "lcov"],
    thresholds: {
      branches: 80,
      functions: 80,
      lines: 80,
    }
  }
},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
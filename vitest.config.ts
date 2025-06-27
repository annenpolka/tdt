import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    includeSource: ["src/**/*.ts", "src/**/*.tsx"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    environment: "node",
  },
});
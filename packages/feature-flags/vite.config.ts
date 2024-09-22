import { resolve } from "node:path";

import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "feature-flags",
      fileName: "index",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});

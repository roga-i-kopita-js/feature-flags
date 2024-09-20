import { resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "feature-flags",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react"],
    },
    sourcemap: true,
  },
});

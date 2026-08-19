import { defineConfig } from "vite-plus";

export default defineConfig({
  base: "/sourceshot/",
  // Resolve @sourceshot/core to its TypeScript source so dev + HMR work across the
  // workspace boundary without a prior build step.
  resolve: { conditions: ["source"] },
});

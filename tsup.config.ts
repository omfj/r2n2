import { defineConfig } from "tsup";

export default defineConfig({
  target: "node20",
  dts: {
    resolve: true,
    entry: "./src/index.ts",
  },
});

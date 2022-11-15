import react from "@vitejs/plugin-react";
import { join, resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/home/",
  build: {
    outDir: "./dist/home",
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": join(resolve(), "src"),
    },
  },
  server: {
    proxy: {
      "/server": "https://seashellw.world",
    },
  },
});

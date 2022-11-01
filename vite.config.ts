import react from "@vitejs/plugin-react";
import { join, resolve } from "path";
import { presetUno } from "unocss";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss({
      presets: [presetUno()],
    }),
    react(),
    visualizer(),
  ],
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

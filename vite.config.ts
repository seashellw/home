import { join, resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import lightningcss from "vite-plugin-lightningcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), lightningcss({})],
  resolve: {
    // 配置路径别名
    alias: {
      "@": join(resolve(), "src"),
    },
  },
  server: {
    proxy: {
      "/server": "https://app.seashellw.world",
    },
  },
  build: {
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
});

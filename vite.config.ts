import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

export default defineConfig({
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: ['@sanity/client'],
  },
  build: {
    cssMinify: true,
  },
});

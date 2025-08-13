import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/steps/step4_rehash/",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  build: {
    outDir: 'target/dist/META-INF/resources/step4_rehash/',
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      },
    },
  },
});
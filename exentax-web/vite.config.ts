import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

const analyze = process.env.BUILD_ANALYZE === "1" || process.env.BUILD_ANALYZE === "true";

export default defineConfig({
  plugins: [
    react(),
    ...(analyze
      ? [
          visualizer({
            filename: path.resolve(import.meta.dirname, "docs/seo/bundle-visualizer.html"),
            template: "treemap",
            gzipSize: true,
            brotliSize: true,
            open: false,
          }) as any,
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    target: "es2020",
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 0,
        manualChunks(id) {
          const blogContentMatch = id.match(/[\\/]client[\\/]src[\\/]data[\\/]blog-content[\\/]([a-z]{2})[\\/]([^\\/]+)\.ts$/);
          if (blogContentMatch) {
            return `blog-${blogContentMatch[1]}-${blogContentMatch[2]}`;
          }
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.match(/[\\/]react[\\/]/)) return "vendor-react";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("wouter")) return "vendor-router";
            if (id.includes("i18next")) return "vendor-i18n";
          }
          return undefined;
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
  esbuild: {
    drop: ["debugger"],
    legalComments: "none",
  },
  server: {
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

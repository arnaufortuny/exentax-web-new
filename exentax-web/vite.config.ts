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
        // 20_000 bytes (20 kB) as a conservative minimum. Rollup's default
        // is 1 byte (basically disabled); 0 is our previous value, which
        // produced 725+ JS chunks after the per-article blog split — each
        // chunk carries HTTP request overhead that outweighs the benefit of
        // fine-grained caching once the page needs more than a handful.
        // 20 kB keeps the blog split (chunks are already ≥ 20 kB each) but
        // collapses the small tail of sub-2kB fragments that currently
        // pollute the waterfall. Tune via measurement on the resulting
        // `dist/public/assets/` file count if needed.
        experimentalMinChunkSize: 20_000,
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

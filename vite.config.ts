import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, benefits from long CDN cache TTL
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Data fetching
          "vendor-query": [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
          ],
          // Internationalization
          "vendor-i18n": [
            "i18next",
            "i18next-browser-languagedetector",
            "i18next-http-backend",
            "react-i18next",
          ],
          // Charts — large library
          "vendor-charts": ["chart.js", "react-chartjs-2"],
          // Icons — large library, isolated to prevent cache busting on app changes
          "vendor-icons": ["@tabler/icons-react"],
          // HTTP client
          "vendor-axios": ["axios"],
        },
      },
    },
    // Slightly above default 500kB to account for the large icons package
    chunkSizeWarningLimit: 600,
  },
});

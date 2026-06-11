import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/GUESS-THE-COUNTRY/", // 🔥 OBLIGATOIRE pour GitHub Pages
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png", "googleaa05bc4e7ded9b1f.html"],
      manifest: {
        name: "Guess The Country",
        short_name: "GeoQuiz",
        description: "Ultimate Geography Challenge - Test your world knowledge!",
        id: "/GUESS-THE-COUNTRY/",
        // Chemins relatifs au scope : compatibles avec GitHub Pages (/GUESS-THE-COUNTRY/)
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "portrait",
        lang: "en",
        background_color: "#0a0a1a",
        theme_color: "#6366f1",
        categories: ["games", "education"],
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          // Entrée maskable séparée (combiner "any maskable" est déconseillé)
          { src: "icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,webmanifest}"],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Drapeaux flagcdn et polices Google mis en cache à la volée pour le hors-ligne
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "flagcdn-cache",
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

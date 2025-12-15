import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy per il backend locale (Gemini AI)
      "/api/gemini": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy per API Football-Data.org
      "/api/football": {
        target: "https://api.football-data.org/v4",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, ""),
        secure: false,
      },
    },
  },
});

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Fail the deploy loudly instead of shipping a site that silently calls localhost.
  if (mode === "production" && !env.VITE_API_URL) {
    throw new Error("VITE_API_URL is not set. Add it in Vercel > Project > Settings > Environment Variables.");
  }

  return {
    plugins: [react()],
    server: { port: 5173 },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            charts: ["recharts"],
            motion: ["framer-motion"],
            emoji: ["emoji-picker-react"],
          },
        },
      },
    },
  };
});

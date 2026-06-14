import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace 'global-translator' with your actual GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: "/global-translator/",
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  server: { port: 5173 },
});

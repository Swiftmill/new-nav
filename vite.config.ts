import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const isDev = process.env.NODE_ENV !== "production";

export default defineConfig(() => ({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  define: {
    __DEV__: JSON.stringify(isDev)
  }
}));

import { defineConfig } from "vite";

export default defineConfig({
  base: "/kws2100-exam-Keev003",
  server: {
    proxy: {
      "/kws2100-exam-Keev003/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: { overlay: true }, // <— make sure this is true or remove `server` entirely
  },
});

// @ts-check
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.oxresidencial.com",
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});

import { defineConfig } from "astro/config";

// The demo is served from https://nikolaiwu.github.io/lunar-blog/.
// To deploy at a domain root, set SITE_URL to your domain and BASE_PATH to "/".
// Astro doesn't load .env files here, so set these in the shell or in CI.
const site = process.env.SITE_URL ?? "https://nikolaiwu.github.io";
const base = process.env.BASE_PATH ?? "/lunar-blog";

// https://astro.build/config
export default defineConfig({
  site,
  base,
});

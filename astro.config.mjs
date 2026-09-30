import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";
import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

// The demo is served from https://nikolaiwu.github.io/lunar-blog/.
// To deploy at a domain root, set SITE_URL to your domain and BASE_PATH to "/".
// Astro doesn't load .env files here, so set these in the shell or in CI.
const site = process.env.SITE_URL ?? "https://nikolaiwu.github.io";
const base = process.env.BASE_PATH ?? "/lunar-blog";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

// Local theme mode, for working on LunarCSS itself:
//
//   LUNARCSS_LOCAL=../lunarcss pnpm dev
//
// compiles the theme and layout from that checkout's SCSS source instead of
// the published package, and reloads the page styles when you save a partial.
// Fonts still come from the package. Without the variable, nothing changes.
// See docs/lunarcss.md.
function localTheme(dir) {
  if (!dir) return {};

  const scss = path.join(path.resolve(dir), "src/scss");
  if (!existsSync(path.join(scss, "main.scss"))) {
    throw new Error(
      `LUNARCSS_LOCAL is "${dir}", but there's no ${scss}/main.scss. ` +
        "Point it at a LunarCSS checkout, or unset it to use the published package.",
    );
  }
  // styleText drops the bold when the output isn't a terminal or NO_COLOR is set
  console.info(
    styleText(
      "bold",
      `🏠 [lunar-blog] Using the local LunarCSS source in ${scss}`,
    ),
  );

  return {
    resolve: {
      // Anchored, so the theme alias doesn't also catch /layout or /fonts
      alias: [
        {
          find: /^@nikolaiwu\/lunarcss$/,
          replacement: path.join(scss, "main.scss"),
        },
        {
          find: /^@nikolaiwu\/lunarcss\/layout$/,
          replacement: path.join(scss, "layout.scss"),
        },
      ],
    },
    // Vite only serves files inside the project unless told otherwise.
    // Setting allow replaces the default, so the project stays in the list.
    server: { fs: { allow: [projectRoot, scss] } },
  };
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Code is highlighted at build time, with no JS in the browser. Each
      // token gets both themes' colours as --shiki-light / --shiki-dark, and
      // one rule in site.css picks between them with light-dark(), so code
      // follows the page's light or dark mode.
      themes: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
      // No inline colours or background: the theme's pre look stays
      defaultColor: false,
      // No inline overflow style: LunarCSS's pre scrolls sideways itself,
      // and wraps code when printing
      wrap: null,
    },
  },
  vite: localTheme(process.env.LUNARCSS_LOCAL),
});

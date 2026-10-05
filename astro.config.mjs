import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { styleText } from "node:util";
import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// The demo is served from https://nikolaiwu.github.io/lunar-blog/.
// To deploy at a domain root, set SITE_URL to your domain and BASE_PATH to "/".
// Astro doesn't load .env files here, so set these in the shell or in CI.
const site = process.env.SITE_URL ?? "https://nikolaiwu.github.io";
const base = process.env.BASE_PATH ?? "/lunar-blog";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

// Puts a horizontal rule before a post's footnotes, so the notes read as
// separate from the post. It's a real <hr>, so LunarCSS draws it as its dotted
// band; the footnotes section is generated, so there's no Markdown to add it to.
// A hast plugin for Sätteri, Astro's Markdown processor.
const footnotesRule = {
  name: "footnotes-rule",
  element: {
    filter: ["section"],
    visit(node, ctx) {
      if (!("dataFootnotes" in (node.properties ?? {}))) return;
      ctx.insertBefore(node, {
        type: "element",
        tagName: "hr",
        properties: {},
        children: [],
      });
    },
  },
};

// Wraps each table in a <div>, so a table too wide for the screen scrolls
// sideways inside it instead of making the whole page scroll. LunarCSS scrolls
// any element whose only child is a table (or a figure holding one), and
// Markdown has no syntax for a wrapper. A table that already has one is left
// as it is.
const tableScroll = {
  name: "table-scroll",
  element: {
    filter: ["table"],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      if (parent?.type === "element") {
        const elements = parent.children.filter((c) => c.type === "element");
        if (parent.tagName === "figure" || elements.length === 1) return;
      }
      ctx.wrapNode(node, {
        type: "element",
        tagName: "div",
        properties: {},
        children: [],
      });
    },
  },
};

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
  // sitemap() writes sitemap-index.xml for every page, under the base path.
  // It leaves out the 404 page by itself, and needs `site` above.
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [footnotesRule, tableScroll] }),
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

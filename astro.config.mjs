import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// The demo is served from https://nikolaiwu.github.io/lunar-blog/.
// To deploy at a domain root, set SITE_URL to your domain and BASE_PATH to "/".
// Astro doesn't load .env files here, so set these in the shell or in CI.
const site = process.env.SITE_URL ?? "https://nikolaiwu.github.io";
const base = process.env.BASE_PATH ?? "/lunar-blog";

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
      // Any Shiki themes work here (https://shiki.style/themes). Check their
      // contrast on LunarCSS's code background: these two stay readable, but
      // most light themes are too pale for its beige.
      themes: { light: "github-light-high-contrast", dark: "catppuccin-mocha" },
      // No inline colours or background: the theme's pre look stays
      defaultColor: false,
      // No inline overflow style: LunarCSS's pre scrolls sideways itself,
      // and wraps code when printing
      wrap: null,
    },
  },
});

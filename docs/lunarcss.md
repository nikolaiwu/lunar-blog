# Using LunarCSS

The theme lives in its own repo, usually checked out next to this one at `../lunarcss`. Its `USER-GUIDE.md` is the user-facing reference (tokens, cards, layout, theme switching), and its `docs/` folder explains the internals. Read those before changing how we use the theme.

## Install and import order

```bash
pnpm add @nikolaiwu/lunarcss
```

Import all three stylesheets once, in the base layout's frontmatter, in this order:

```astro
---
import "@nikolaiwu/lunarcss/fonts"; // self-hosted Space Grotesk / Space Mono
import "@nikolaiwu/lunarcss"; // the theme, in @layer lunarcss
import "@nikolaiwu/lunarcss/layout"; // page structure, in @layer lunarcss-layout
import "../styles/site.css"; // ours, unlayered
---
```

- **Cascade layers are ordered by first appearance.** The theme's `@layer lunarcss` must reach the browser before `@layer lunarcss-layout`, or the theme overrides the layout. After a build, check the order in the emitted CSS. If Astro or Vite ever reorders them, add `@layer lunarcss, lunarcss-layout;` in a file imported first.
- `site.css` is unlayered, so it beats both layers whatever its specificity. Never use `!important`.
- The fonts CSS points at font files relative to itself. Vite copies and hashes them, so nothing is requested from Google or a CDN.
- The package is on 0.x. A minor bump (0.1 → 0.2) can be breaking: read the LunarCSS CHANGELOG before upgrading.

## Markup patterns the theme expects

LunarCSS styles elements, and the layout stylesheet places them by structure. Write markup that matches these patterns, not CSS that fights them.

- **Page shell:** `body > header` holding the site title (one link with the logo and the title, straight in the header) and a `nav` (they share a row and wrap on small screens), then `main`, an optional `aside`, and `body > footer`. `main` and `aside` as siblings become a sidebar layout above 60rem; source order picks the side.
- **Navigation:** `nav > ul > li > a` makes a horizontal row with no bullet ticks. Mark the current page with `aria-current="page"`, not a class.
- **Cards:** every `article` is a card (cut-corner border, with optional `header` and `footer`). A post preview is `article > header > h2/h3 > a`, then a `p`, then a `footer` with the date and tags.
- **Card grid:** a parent whose direct children are **all** `article`s (at least two) becomes a responsive grid. Any other child, such as a heading or a "more posts" link, turns the grid off, so put those outside the wrapper. A single post doesn't get a grid, which is fine.
- **Full-page post:** the post is the only `article` in `main`, and LunarCSS leaves such an article plain instead of drawing it as a card. Keep it that way: a second `article` directly in `main` would turn both into cards. Wrap anything card-like in its own element. A plain article has no card spacing, so `site.css` gives its `header` (and the archive's `main > header`) the space below, with the `h1`'s bottom margin removed.
- **Dates:** always `<time datetime="…">`.
- **Wide tables:** wrap a table in a `div` (as its only child) and the wrapper scrolls sideways. Markdown tables are wrapped for you by the `tableScroll` plugin (see [architecture.md](architecture.md), "Markdown pipeline"); in a page or component, write the `div` yourself.
- **Images in a line of text:** the theme makes `img` a block with a bottom margin, so an icon or logo that sits next to text has to be an inline `svg` (Astro's SVG components inline the file), sized in `em`. Inside an inline link, keep it under about 1em tall, or the link's tint and underline won't cover it. See the logo in [architecture.md](architecture.md).
- **Code blocks:** `pre` scrolls sideways and gets focus styling on its own. Shiki's `tabindex="0"` on `pre` is fine.

The theme draws with `::before` and `::after` on several elements (cards, `h1`–`h3`, `ul > li`, `dt`, `blockquote`, `code`, `kbd`, `summary`, `q`, `legend`, `figcaption`, and `a[target="_blank"]`). Don't put content in those pseudo-elements. The full table is in the User Guide under "Pseudo-elements the theme uses".

## Theming

- Customize through `--lunar-*` tokens on `:root` in `site.css`. The main pair is `--lunar-light` / `--lunar-dark`, plus `--lunar-accent`. The starter ships with the theme's defaults, and the README shows users how to change them.
- Light and dark come from `light-dark()` plus `color-scheme`. `data-theme="light|dark"` on `<html>` forces a mode, and without it the page follows the system setting. The blog never sets it, so it always follows the system (see [architecture.md](architecture.md), "Light and dark").
- Never use raw colours or `--color-*` primitives.

## Fixing the theme

Theme gaps are fixed in LunarCSS, developed against this blog with local theme mode (`LUNARCSS_LOCAL=../lunarcss pnpm dev`). The workflow is in [CONTRIBUTING.md](../CONTRIBUTING.md#working-on-lunarcss-alongside-the-blog).

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

- **Page shell:** `body > header` holding the site title and a `nav` (they share a row and wrap on small screens), then `main`, an optional `aside`, and `body > footer`. `main` and `aside` as siblings become a sidebar layout above 60rem; source order picks the side.
- **Navigation:** `nav > ul > li > a` makes a horizontal row with no bullet ticks. Mark the current page with `aria-current="page"`, not a class.
- **Cards:** every `article` is a card (cut-corner border, with optional `header` and `footer`). A post preview is `article > header > h2/h3 > a`, then a `p`, then a `footer` with the date and tags.
- **Card grid:** a parent whose direct children are **all** `article`s (at least two) becomes a responsive grid. Any other child, such as a heading or a "more posts" link, turns the grid off, so put those outside the wrapper. A single post doesn't get a grid, which is fine.
- **Full-page post:** the post itself is semantically an `article`, but a whole post drawn as a card looks wrong. LunarCSS's User Guide gives a reset for `main > article` ("Full-page articles"). Put it in `site.css`, and log it in [theme-gaps.md](theme-gaps.md) as a possible theme feature.
- **Dates:** always `<time datetime="…">`.
- **Wide tables:** wrap a table in a `div` (as its only child) and the wrapper scrolls sideways. Markdown tables aren't wrapped, so check a wide one on a phone.
- **Code blocks:** `pre` scrolls sideways and gets focus styling on its own. Shiki's `tabindex="0"` on `pre` is fine.

The theme draws with `::before` and `::after` on several elements (cards, `h1`–`h3`, `ul > li`, `dt`, `blockquote`, `code`, `kbd`, `summary`, `q`, `legend`, `figcaption`, and `a[target="_blank"]`). Don't put content in those pseudo-elements. The full table is in the User Guide under "Pseudo-elements the theme uses".

## Theming

- Customize through `--lunar-*` tokens on `:root` in `site.css`. The main pair is `--lunar-light` / `--lunar-dark`, plus `--lunar-accent`. The starter ships with the theme's defaults, and the README shows users how to change them.
- Light and dark come from `light-dark()` plus `color-scheme`. `data-theme="light|dark"` on `<html>` forces a mode, and without it the page follows the system setting.
- Never use raw colours or `--color-*` primitives.

## Changing the theme itself

When something is a theme gap, not a starter problem:

1. Add it to [theme-gaps.md](theme-gaps.md) with the markup that triggers it and a screenshot or description.
2. Ask the user whether to file a `nikolaiwu/lunarcss` issue (`gh issue create -R nikolaiwu/lunarcss`) or fix it in `../lunarcss` directly. That repo has its own CLAUDE.md and rules: read `../lunarcss/CLAUDE.md` before editing there, and commit in each repo separately. A session started with `claude --add-dir ../lunarcss` can edit both.
3. Develop the fix against the blog with **local theme mode** (below), then check it on the LunarCSS showcase and demo too. The theme must stay generic, so a change that only makes sense for this blog belongs in `site.css`, not the theme.
4. After LunarCSS releases the fix: bump `@nikolaiwu/lunarcss` here, run without local mode, remove the workaround from `site.css`, and update [theme-gaps.md](theme-gaps.md).

## Local theme mode

`LUNARCSS_LOCAL=../lunarcss pnpm dev` compiles the theme and layout from the LunarCSS **SCSS source** in that checkout, instead of the published package. Vite watches the partials, so saving a file in `../lunarcss/src/scss/` updates the blog in the browser: no LunarCSS build, no release, and no second process.

How it's wired in `astro.config.mjs`, only when `LUNARCSS_LOCAL` is set:

- `vite.resolve.alias` maps exactly `@nikolaiwu/lunarcss` to `<path>/src/scss/main.scss` and `@nikolaiwu/lunarcss/layout` to `<path>/src/scss/layout.scss`. Use anchored regexes (`/^@nikolaiwu\/lunarcss$/`) so the two don't catch each other, or `/fonts`. Fonts always come from the npm package: `fonts.scss` only resolves inside the LunarCSS build, and fonts rarely change.
- `vite.server.fs.allow` gets the LunarCSS path added, next to `searchForWorkspaceRoot(process.cwd())`, since Vite refuses to serve files outside the project otherwise.
- The config fails fast with a clear error if `<path>/src/scss/main.scss` doesn't exist, and logs one line saying the local theme is in use, so it's never on by accident.
- `sass` is a dev dependency (Vite needs it to compile the SCSS). Keep its range in line with LunarCSS's.

Why this and not `pnpm add ../lunarcss` (a `link:` dependency): the link changes `package.json` and the lockfile, which is easy to commit by mistake, and the package's exports point at the built `dist/`, so every theme edit would need a LunarCSS build. Local mode leaves the dependencies untouched, so `main`, CI and template users always get the published theme.

Things to keep in mind:

- Local mode is the unminified source, not the published `dist/`. The difference is only minification and the banner, but the final check is always a normal `pnpm build` against the released version.
- Don't commit blog changes that depend on an unreleased theme fix (such as removing a `site.css` workaround) until that LunarCSS version is released and the dependency is bumped. Otherwise `main` breaks for everyone.
- `pnpm build` and `pnpm preview` also respect `LUNARCSS_LOCAL`, which is handy for checking a theme change in the built blog before releasing LunarCSS.

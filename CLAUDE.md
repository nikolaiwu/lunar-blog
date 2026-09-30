# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Details live in `docs/`. Each section below says what its file covers — read it when the task touches that area.

## Project

Lunar Blog is a free, MIT-licensed Astro blog starter built on [LunarCSS](https://github.com/nikolaiwu/lunarcss) (`@nikolaiwu/lunarcss` on npm), a classless CSS theme by the same author. Posts are Markdown/MDX, rendered to plain semantic HTML, and the theme styles that HTML with element selectors only. People install the starter with `npm create astro@latest -- --template nikolaiwu/lunar-blog`.

The starter is also the theme's first real-world test. When real content looks wrong, that usually points to a gap in LunarCSS, not something this repo should patch.

These rules apply everywhere, so they're stated up front:

- **No `class` attributes in our markup** (layouts, components, pages, MDX). Structure comes from semantic elements, the same way LunarCSS's own Acme demo works. Generated markup (Shiki, footnotes, heading anchors) may carry classes, but we never style through them.
- **Almost no CSS of our own.** The site stylesheet `src/styles/site.css` stays small and unlayered, and every rule in it has a comment saying why the theme can't do it. No component `<style>` blocks.
- **Theme gaps go upstream.** If an element looks wrong, record it in `docs/theme-gaps.md` and propose an issue on `nikolaiwu/lunarcss`. Don't work around it with page CSS unless the brief allows it.
- **Tokens only.** Any CSS we do write uses `var(--lunar-*)` tokens, never raw colours or sizes.
- **No third-party requests.** Fonts are self-hosted through the LunarCSS fonts stylesheet. No Google Fonts, analytics, embeds or CDN scripts in the template.
- **Zero client JS.** Light and dark follow the reader's system setting through the theme's `light-dark()`; there's no theme toggle. No UI framework islands and no `ClientRouter` / view transitions.
- **Check Astro's current docs, not memory.** Astro ships major versions often, and APIs such as content collections, the Markdown config and image handling change between them. Read https://docs.astro.build before using an API, and follow the current version's conventions.
- Run `pnpm format` after editing.

## Brief

Reference `docs/brief.md`: goals, scope, what's out of scope, why Astro, milestones, and the definition of done.

The maintainer's working checklist is `PUBLISHING.local.md` (gitignored): the milestones broken into tasks, one-time setup, the release steps, listing and measuring, and troubleshooting. Tick items there as they're done.

## Architecture

Reference `docs/architecture.md`: the file layout, content collection schema, routes, `site.config.ts`, the Markdown pipeline (Shiki, footnotes, heading anchors), RSS and sitemap.

## Using LunarCSS

Reference `docs/lunarcss.md`: import order, cascade layers, the classless markup patterns the theme and layout stylesheet expect (page shell, card grid, full-page article), and local theme mode (`LUNARCSS_LOCAL=../lunarcss pnpm dev`), which live-reloads edits to the LunarCSS source for fixing theme gaps.

## Conventions

Reference `docs/conventions.md`: package manager, formatting, dependencies, accessibility, commits and issue tracking.

## Deploying and publishing

Reference `docs/deploy.md`: the GitHub Pages demo site and its `base` path, the `create astro` template flow, README requirements, and the Astro themes directory listing.

## Theme gaps

Reference `docs/theme-gaps.md`: the running list of places where real blog content exposed something LunarCSS doesn't handle yet. Add to it as you find them.

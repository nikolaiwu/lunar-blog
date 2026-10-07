# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This blog is built on [Lunar Blog](https://github.com/nikolaiwu/lunar-blog), an Astro starter styled by [LunarCSS](https://github.com/nikolaiwu/lunarcss) (`@nikolaiwu/lunarcss` on npm), a classless CSS theme. Posts are Markdown or MDX. Astro renders them to plain, semantic HTML at build time, and the theme styles that HTML by element, with no classes. The output is a static site with no JavaScript in the browser.

## How it's built

These choices hold the starter together. Keep to them unless the blog's owner decides otherwise, and if a request would break one, say so and suggest the way that fits.

- **No `class` attributes** in layouts, components, pages or posts. LunarCSS styles elements (`article`, `nav`, `figure`, `time` …) and places them by structure, so the right element does the job a class would. Classes would need CSS of our own, which the theme's updates can't reach. Generated markup (code highlighting, footnotes, task lists) carries a few classes; leave them, but don't style through them.
- **Customize through tokens, in `src/styles/site.css`.** It's the one stylesheet of our own: small, unlayered (so it beats the theme without `!important`), written in `var(--lunar-*)` tokens, with a comment on each rule saying why the theme can't do it. No component `<style>` blocks or inline `style`: Astro's scoped styles are unlayered too, and would fight the theme.
- **No client JavaScript.** Light and dark mode follow the reader's system setting through the theme's `light-dark()`; there's no toggle. No UI framework islands, no view transitions.
- **No third-party requests.** The fonts are self-hosted through the LunarCSS fonts stylesheet. No Google Fonts, CDN scripts or embeds unless the owner asks for them.
- **Check Astro's current docs, not memory.** Astro changes APIs between major versions (content collections, the Markdown config, images). Read https://docs.astro.build before using one.

## Where things are

| Path                     | What                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `src/site.config.ts`     | Title, description, author, language, navigation, posts per page, the default preview image |
| `src/content/posts/`     | The posts, one `.md` or `.mdx` file (or folder) each                                        |
| `src/content.config.ts`  | The posts' frontmatter schema                                                               |
| `src/pages/`             | Pages: home, archive (`posts/`), tags, about, 404, RSS, robots.txt                          |
| `src/layouts/Base.astro` | Every page's shell: head, header with the logo and navigation, footer                       |
| `src/layouts/Post.astro` | A single post                                                                               |
| `src/components/`        | `PostCard`, `Figure`, `FormattedDate`, `PostsHeader`, `Seo`                                 |
| `src/styles/site.css`    | Your CSS on top of the theme                                                                |
| `src/assets/logo.svg`    | The header logo                                                                             |
| `public/`                | `favicon.svg`, `apple-touch-icon.png`, `og-image.png`                                       |
| `astro.config.mjs`       | Site URL and base path, Markdown and code highlighting                                      |

## Writing a post

A post is a file in `src/content/posts/`. Its name is its URL: `hello-world.md` becomes `/posts/hello-world/`. A post with its own images is a folder, `hello-world/index.md`, with the images beside it. A name can't be only digits (`/posts/2/` is an archive page) or `list` (`/posts/list/` is the list view); the build stops if it is.

```md
---
title: Hello, world
description: One or two sentences, used on cards, in search results and in the RSS feed.
pubDate: 2026-10-07
updatedDate: 2026-10-08 # optional, shown as "Updated …"
tags: [astro, dark-mode] # optional, lower-case words joined by hyphens
draft: true # optional: shows in dev, left out of the build
heroImage: ./cover.jpg # optional, relative to the post
heroImageAlt: What the image shows # required with heroImage
---
```

- The schema checks the frontmatter at build time and names the file when something's wrong.
- Each tag gets a page at `/tags/<tag>/`.
- Images use Markdown's `![alt](./file.png)`, so Astro optimizes them. Always write alt text. Astro doesn't process a local image inside raw HTML.
- For an image with a caption, write the post as `.mdx` and use the `Figure` component. The caption is a prop, because MDX wraps child text in a `<p>`:

  ```mdx
  import Figure from "../../components/Figure.astro";
  import chart from "./chart.png";

  <Figure src={chart} alt="What the image shows" caption="The caption." />
  ```

  The import path depends on how deep the post is (one more `../` for a post in its own folder). Only use MDX when a post needs a component: a stray `<` or `{` in MDX text breaks the build.

- GitHub-flavoured Markdown works: tables (wide ones scroll on their own), task lists, footnotes, strikethrough.

## Adding a page

A Markdown file in `src/pages/` becomes a page at its own URL, using the base layout:

```md
---
layout: ../layouts/Base.astro
title: Now
description: What I'm working on.
---
```

For a page with logic, write an `.astro` file that wraps its content in `<Base title="…" description="…">`. Add it to `nav` in `src/site.config.ts` to link it from the header.

## Markup the theme expects

- **Page shell:** `body > header` (logo, title, `nav`), `main`, and `body > footer`. An `aside` next to `main` becomes a sidebar on wide screens.
- **Navigation:** `nav > ul > li > a` is a row of links. Mark the current page with `aria-current="page"`, which the theme shows as the link's active state.
- **Cards:** every `article` is a card. Put cards in a wrapper that holds nothing but articles, and it becomes a responsive grid; anything else in the wrapper turns the grid off. `PostCard` makes a post card; pass `headingLevel` so headings stay in order (2 under the page's `h1`, 3 under an `h2`).
- **A full post:** the only `article` in `main` is drawn plain, not as a card. A second `article` directly in `main` turns both into cards.
- **Dates:** always `<time datetime="…">`, through `FormattedDate`.
- **Headings** in order on every page, with one `h1`.
- **Icons beside text:** an inline `svg` (import the file in Astro), sized in `em`. The theme makes every `img` a block with a bottom margin.
- **Spaces in `.astro` files:** Astro drops the whitespace where a line of text ends and the next starts with a tag or `{expression}`, so `or the` then `<a>` on the next line renders as "or the<a>". End such lines with `{" "}`.

## Links and the base path

The blog can live at a domain root or under a path (the demo is at `/lunar-blog/`). Build every internal link and asset URL with `url()` from `src/lib/url.ts`: `url("posts/")`, `url("tags/css/")`. Never hard-code a leading `/`: it works in dev and breaks once deployed under a path. In Markdown posts, use relative links (`../other-post/`).

To deploy, set `SITE_URL` (e.g. `https://example.com`) and `BASE_PATH` (`/` for a domain root) in the build environment; `astro.config.mjs` reads them. `pnpm build && pnpm preview` serves the build under its base path, to check links before deploying.

## Customizing the look

- **Colours:** set tokens on `:root` in `site.css`. The main pair is `--lunar-light` and `--lunar-dark` (light mode uses the light one as the background, dark mode swaps them), plus `--lunar-accent`. `--lunar-muted-mix` and `--lunar-muted-text-mix` tune the muted tones.
- **Fonts, spacing, sizes:** every token is in the [LunarCSS User Guide](https://github.com/nikolaiwu/lunarcss/blob/main/USER-GUIDE.md). Read it before changing how something looks.
- **Logo:** replace `src/assets/logo.svg`. It's inlined into the header link, so set its size in `em` in the file (`width` sets it; the height follows the `viewBox`).
- **Icons and preview image:** replace `public/favicon.svg`, `public/apple-touch-icon.png` (180×180, opaque) and `public/og-image.png` (1200×630, used by pages without a hero image), and update `ogImageAlt` in `site.config.ts`.

## When something looks wrong

If an element looks wrong with real content, it's usually a gap in the theme, not in the blog. Report it on [nikolaiwu/lunarcss](https://github.com/nikolaiwu/lunarcss/issues), and meanwhile add the smallest rule that fixes it to `site.css`, with a comment linking the issue. Problems with the starter itself go to [nikolaiwu/lunar-blog](https://github.com/nikolaiwu/lunar-blog/issues).

## Commands

| Command        | What it does                                |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Dev server with hot reload; drafts included |
| `pnpm build`   | Build the static site to `dist/`            |
| `pnpm preview` | Serve the build, under the base path        |
| `pnpm check`   | Type-check (`astro check`)                  |
| `pnpm format`  | Format with Prettier; run it after editing  |

Astro's dev server keeps running in the background: stop it with `pnpm astro dev stop`.

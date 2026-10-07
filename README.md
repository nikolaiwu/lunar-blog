# 🌙 Lunar Blog

[![License: MIT](https://img.shields.io/github/license/nikolaiwu/lunar-blog)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/built_with-Astro-ff5d01)](https://astro.build)
[![Styled with LunarCSS](https://img.shields.io/badge/styled_with-LunarCSS-ff5623)](https://github.com/nikolaiwu/lunarcss)

A minimal Astro blog starter with no classes and no JavaScript. Write Markdown, and [LunarCSS](https://github.com/nikolaiwu/lunarcss), a classless CSS theme, styles the plain HTML it becomes: retro-futuristic, in light and dark.

[Live demo](https://nikolaiwu.github.io/lunar-blog/) · [Changelog](CHANGELOG.md)

[![The Lunar Blog home page, split diagonally between the light and dark themes: the header with the logo and navigation, the intro, and a grid of post cards](https://raw.githubusercontent.com/nikolaiwu/lunar-blog/main/.github/screenshot.png)](https://nikolaiwu.github.io/lunar-blog/)

## Install

```bash
npm create astro@latest -- --template nikolaiwu/lunar-blog
```

Or with pnpm: `pnpm create astro@latest --template nikolaiwu/lunar-blog`. Then `npm run dev`, and open the address it prints.

## Features

- **Classless:** plain, semantic HTML with no `class` attributes, styled by LunarCSS. One small stylesheet of your own for tweaks
- **No client JavaScript:** a static site; light and dark follow the reader's system setting
- **No third-party requests:** self-hosted fonts, no analytics, no CDN scripts
- **Markdown and MDX posts,** with a typed frontmatter schema, drafts, hero images, footnotes, captioned figures, and wide tables that scroll on small screens
- **Code highlighting at build time,** switching between light and dark with the page
- **Archive** as cards (paginated) or as one list, **tag pages**, previous and next post links
- **RSS, sitemap, robots.txt,** canonical URLs and link previews (Open Graph), with each post's hero image as its preview
- **Works anywhere:** at a domain root or under a path, such as a GitHub Pages project site
- **Accessible:** semantic structure, visible focus, WCAG AA text contrast, and Windows contrast themes
- **Claude Code ready:** [CLAUDE.md](CLAUDE.md) explains the blog to Claude, so it can write posts and pages the way the theme expects

## Getting started

1. **Make it yours:** set the title, description, author, language and navigation in [`src/site.config.ts`](src/site.config.ts).
2. **Set its address:** in [`astro.config.mjs`](astro.config.mjs), change the `site` and `base` defaults (the demo's) to your own, or set them when you deploy (see [Deploying](#deploying)). Links, previews, the feed and the sitemap are built from them.
3. **Clear the samples:** delete everything in `src/content/posts/` and `src/assets/moonrise.svg`, and rewrite `src/pages/about.md` and this README (its screenshot is `.github/screenshot.png`). If you installed with npm, yarn or bun, delete the starter's `pnpm-lock.yaml` too.
4. **Write a post:** add a Markdown file to `src/content/posts/`. Its name is its URL: `hello-world.md` becomes `/posts/hello-world/`.

```md
---
title: Hello, world
description: One or two sentences, for cards, search results and the RSS feed.
pubDate: 2026-10-07
updatedDate: 2026-10-08 # optional
tags: [astro, dark-mode] # optional, lower-case words joined by hyphens
draft: true # optional: shows in dev, left out of the build
heroImage: ./cover.jpg # optional, next to the post
heroImageAlt: What the image shows # required with heroImage
---

Your post, in Markdown.
```

A post with its own images can be a folder: `hello-world/index.md`, with the images beside it. For an image with a caption, write the post in MDX and use the `Figure` component; a Markdown file in `src/pages/` becomes a standalone page. [CLAUDE.md](CLAUDE.md) has the details, with or without Claude.

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Dev server with hot reload; drafts included |
| `npm run build`   | Build the static site to `dist/`            |
| `npm run preview` | Serve the build, under its base path        |
| `npm run check`   | Type-check                                  |
| `npm run format`  | Format with Prettier                        |

## Customizing

Set LunarCSS's tokens in [`src/styles/site.css`](src/styles/site.css). The main colors are a light and a dark one, swapped between the themes, plus an accent:

```css
:root {
  --lunar-light: #f5f5f4;
  --lunar-dark: #1c1917;
  --lunar-accent: light-dark(#7c3aed, #a78bfa);
}
```

- **Everything else** (type, spacing, borders, the muted tones) is a token too. See the [LunarCSS User Guide](https://github.com/nikolaiwu/lunarcss/blob/main/USER-GUIDE.md).
- **Fonts:** Space Grotesk and Space Mono are self-hosted by the theme's fonts stylesheet. To change them, self-host your own (a [Fontsource](https://fontsource.org) package, or files with `@font-face`), set `--lunar-font-sans` and `--lunar-font-mono`, and remove the fonts import from `src/layouts/Base.astro`.
- **Logo and icons:** replace `src/assets/logo.svg` (inlined into the header, sized in `em`), `public/favicon.svg`, `public/apple-touch-icon.png` (180×180) and `public/og-image.png` (1200×630, the preview for pages without a hero image).

Keep the markup classless: the theme styles elements by what they are. If something looks wrong with your content, it may be a gap in the theme; please [open an issue on LunarCSS](https://github.com/nikolaiwu/lunarcss/issues).

## Deploying

`npm run build` writes a static site to `dist/`. Two settings decide its address: `SITE_URL`, the origin (`https://example.com`), and `BASE_PATH`, the path it's served under (`/` at a domain root). Set them as environment variables when building, or change the defaults in `astro.config.mjs`.

- **GitHub Pages:** the included workflow (`.github/workflows/pages.yml`) deploys on every push to `main`. Set **Settings → Pages → Source** to **GitHub Actions**, once. It gets the site's address from GitHub, so a project site, a user site and a custom domain all work with nothing to change.
- **Netlify, Cloudflare Pages, Vercel and similar:** build command `npm run build`, output directory `dist`, with `SITE_URL` and `BASE_PATH=/` in the host's environment variables. Delete `.github/workflows/pages.yml`, or every push runs it and it fails.
- **Any static host:** build with the right `SITE_URL` and `BASE_PATH`, and upload `dist/`. Delete the workflow here too.

Check with `npm run build && npm run preview` before deploying: it serves the build under its base path, so broken links show up.

## Contributing

Bug reports and fixes are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

- [LunarCSS](https://github.com/nikolaiwu/lunarcss), the classless theme, MIT
- [Astro](https://astro.build), MIT
- [Space Grotesk](https://github.com/floriankarsten/space-grotesk) and [Space Mono](https://github.com/googlefonts/spacemono), SIL Open Font License 1.1
- Code highlighting with [Shiki](https://shiki.style): GitHub Light High Contrast (MIT) and [Catppuccin](https://github.com/catppuccin/catppuccin) Mocha (MIT)

MIT, see [LICENSE](LICENSE).

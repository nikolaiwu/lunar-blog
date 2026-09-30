# Architecture

A static Astro site (`output: "static"`, no adapter). Everything is rendered at build time; the only script in the browser is the theme toggle.

## File layout

```
lunar-blog/
├── astro.config.mjs          # site, base, integrations, Markdown/Shiki config
├── src/
│   ├── site.config.ts        # the one file users edit first: title, author, nav…
│   ├── content.config.ts     # the posts collection and its schema
│   ├── content/posts/        # sample posts (.md and .mdx), co-located images
│   ├── layouts/
│   │   ├── Base.astro        # <html>, head, page shell (header, main, footer)
│   │   └── Post.astro        # a single post
│   ├── components/           # Head/SEO, PostCard, PostGrid, Pagination,
│   │                         # TagList, FormattedDate, ThemeToggle
│   ├── lib/
│   │   ├── url.ts            # url(): base-path-aware internal links
│   │   └── posts.ts          # published posts, newest first
│   ├── pages/
│   │   ├── index.astro       # intro and latest posts
│   │   ├── posts/[...page].astro  # archive: /posts/, /posts/2/ …
│   │   ├── posts/[id].astro  # a post: /posts/<id>/
│   │   ├── tags/index.astro  # all tags with post counts
│   │   ├── tags/[tag].astro  # posts with that tag
│   │   ├── about.md          # example standalone page, using Base
│   │   ├── 404.astro
│   │   └── rss.xml.ts
│   └── styles/site.css       # the small unlayered stylesheet (see conventions)
└── public/                   # favicon, og-image.png, robots.txt
```

Treat this as the target shape, not a fixed contract. If current Astro conventions differ (file names, collection config location), follow Astro and update this file.

## Content collection

One `posts` collection, loaded from `src/content/posts/` with the glob loader. The schema, in Zod through Astro's re-export:

| Field          | Type                       | Notes                                           |
| -------------- | -------------------------- | ----------------------------------------------- |
| `title`        | string                     |                                                 |
| `description`  | string                     | Card text, meta description, RSS summary        |
| `pubDate`      | date (coerced)             |                                                 |
| `updatedDate`  | date, optional             | Shown as "Updated …" when present               |
| `tags`         | string array, default `[]` | Lower-case slugs; display them as written       |
| `draft`        | boolean, default `false`   | Drafts show in `pnpm dev`, never in the build   |
| `heroImage`    | `image()`, optional        | Optimized by Astro; alt text in `heroImageAlt`  |
| `heroImageAlt` | string, optional           | Required when `heroImage` is set (use a refine) |

Put the "published posts, newest first" query in one helper (e.g. `src/lib/posts.ts`) so every page filters drafts the same way.

Post ids come from file names. A post id that's only a number would collide with an archive page (`/posts/2/`), so reject that with a clear build error.

## Routes

- **`/`**: a short intro (from `site.config.ts`) and the latest `homePostCount` posts as a card grid, then a link to the archive.
- **`/posts/`**, **`/posts/2/`**…: the paginated archive (`paginate()`, `postsPerPage` from config), with previous/next links in a `nav`.
- **`/posts/<id>/`**: the post, with previous/next links to its neighbours by date.
- **`/tags/`** and **`/tags/<tag>/`**: tag pages, not paginated in v1.
- **`/rss.xml`**: `@astrojs/rss`, title, description, date and link per post. Link it from `<head>` (`rel="alternate"`) and the footer.
- **`/about/`**: a Markdown page using the base layout.
- **`/404.html`**.
- The sitemap comes from `@astrojs/sitemap`, which needs `site` set.

Every internal link must work under a `base` path (the demo is served from `/lunar-blog/`). Build URLs through `url()` in `src/lib/url.ts`, which prefixes `import.meta.env.BASE_URL`, and never hard-code a leading `/`. See [deploy.md](deploy.md).

In `Base.astro` the site title in `body > header` is a link in a `p`, not a heading, so each page's own title is its only `h1`. The layout stylesheet only needs the `nav` in the header, not a heading.

## `site.config.ts`

A typed object: `title`, `description`, `author`, `lang` (for `<html lang>`), `nav` (label and href pairs), `homePostCount`, `postsPerPage`, and the default OG image. Pages read from here, never hard-coded strings, so a new user renames the blog in one place.

## Markdown pipeline

- **GFM** (tables, task lists, strikethrough, footnotes) is on by default in Astro.
- **Syntax highlighting:** Astro's built-in Shiki at build time, with two themes, a light and a dark one (LunarCSS's showcase uses Catppuccin Latte and Mocha), and `defaultColor: false`. The tokens then carry `--shiki-light` / `--shiki-dark` custom properties instead of inline colours, and one rule in `site.css` picks between them with `light-dark()`, so highlighting follows the theme toggle with no JS. `defaultColor: false` also keeps Shiki from painting a background on `pre`, so the theme's code block look stays. Check the generated HTML after any Astro upgrade.
- **Footnotes:** remark-rehype puts the "Footnotes" heading in an `h2` with an `sr-only` class. We don't style classes, so either configure the label (Astro exposes `markdown.remarkRehype` options) or accept a visible heading. Decide by how it looks in the theme, and log it in [theme-gaps.md](theme-gaps.md).
- **Heading anchors:** Astro adds `id`s to headings. If we add visible anchor links (rehype-autolink-headings or similar), configure it to emit no classes and check how the theme's link chip and heading marks look together.
- **Images** in posts go through Astro's image pipeline (`sharp`). Always provide alt text.
- **MDX:** `@astrojs/mdx`. The sample MDX post shows a component, but components must follow the no-classes rule too.

## Theme toggle

A `<button>` in the header nav. Two parts:

1. An `is:inline` script in `<head>`, before the stylesheets, that reads `localStorage.theme` and sets `data-theme` on `<html>` before first paint. It must be inline, because a bundled module runs too late and the page would flash.
2. A normal (bundled) `<script>` that toggles between light and dark and saves the choice. Base it on LunarCSS's `src/theme-toggle.js`: with no saved choice it reads `prefers-color-scheme` to work out the current theme.

The button needs an accessible name. Use `aria-pressed` or an updated label so screen readers hear the state.

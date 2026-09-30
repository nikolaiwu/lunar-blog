# Architecture

A static Astro site (`output: "static"`, no adapter). Everything is rendered at build time, and no script runs in the browser.

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
│   ├── components/           # Figure, FormattedDate, PostCard, Seo
│   │                         # (grids, pagination and tag links are inline)
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
│   │   ├── rss.xml.ts
│   │   └── robots.txt.ts     # robots.txt, with the sitemap URL from `site` + `base`
│   └── styles/site.css       # the small unlayered stylesheet (see conventions)
├── design/                   # og-image.py (writes og-image.svg) and
│                             # og-image-png.sh (renders public/og-image.png);
│                             # apple-touch-icon.sh (renders it from favicon.svg)
└── public/                   # favicon.svg, apple-touch-icon.png, og-image.png
```

Treat this as the target shape, not a fixed contract. If current Astro conventions differ (file names, collection config location), follow Astro and update this file.

## Content collection

One `posts` collection, loaded from `src/content/posts/` with the glob loader. The schema, in Zod through Astro's re-export:

| Field          | Type                       | Notes                                                                           |
| -------------- | -------------------------- | ------------------------------------------------------------------------------- |
| `title`        | string                     |                                                                                 |
| `description`  | string                     | Card text, meta description, RSS summary                                        |
| `pubDate`      | date (coerced)             |                                                                                 |
| `updatedDate`  | date, optional             | Shown as "Updated …" when present                                               |
| `tags`         | string array, default `[]` | Lower-case slugs (`dark-mode`), checked by the schema; each gets `/tags/<tag>/` |
| `draft`        | boolean, default `false`   | Drafts show in `pnpm dev`, never in the build                                   |
| `heroImage`    | `image()`, optional        | Optimized by Astro; alt text in `heroImageAlt`                                  |
| `heroImageAlt` | string, optional           | Required when `heroImage` is set (use a refine)                                 |

Put the "published posts, newest first" query in one helper (e.g. `src/lib/posts.ts`) so every page filters drafts the same way.

Post ids come from file names: `hello-world.md` and `hello-world/index.md` both give `hello-world`. Use the folder form when a post has its own images. A post id that's only a number would collide with an archive page (`/posts/2/`), so `getPosts()` in `src/lib/posts.ts` stops the build with an error naming the file. The check lives there, not in the schema, because the schema never sees the id and Astro's default id function isn't exported.

## Routes

- **`/`**: a short intro (from `site.config.ts`) and the latest `homePostCount` posts as a card grid, then a link to the archive.
- **`/posts/`**, **`/posts/2/`**…: the paginated archive (`paginate()`, `postsPerPage` from config), with previous/next links in a `nav`.
- **`/posts/<id>/`**: the post, with previous/next links to its neighbours by date.
- **`/tags/`** and **`/tags/<tag>/`**: tag pages, not paginated in v1.
- **`/rss.xml`**: `@astrojs/rss`, title, description, date, tags (as categories) and link per post, plus an `atom:link rel="self"`, which feed validators ask for. Linked from `<head>` (`rel="alternate"`) and the footer. Pass `rss()` the blog's home URL as `site`, base path included, since it becomes the channel link: `context.site` alone is just the host. Item links come from `url()`.
- **`/about/`**: a Markdown page using the base layout.
- **`/404.html`**.
- **`/sitemap-index.xml`** (and `sitemap-0.xml`): `@astrojs/sitemap`, which needs `site` set. It includes the base path, leaves out the 404 page by itself, and only lists built pages, so drafts never appear. Linked from `<head>` (`rel="sitemap"`, through `url()`). Build only: `pnpm dev` doesn't serve it.

Every internal link must work under a `base` path (the demo is served from `/lunar-blog/`). Build URLs through `url()` in `src/lib/url.ts`, which prefixes `import.meta.env.BASE_URL`, and never hard-code a leading `/`. See [deploy.md](deploy.md).

In `Base.astro` the site title in `body > header` is a link in a `p`, not a heading, so each page's own title is its only `h1`. The layout stylesheet only needs the `nav` in the header, not a heading.

## `site.config.ts`

A typed object: `title`, `description`, `author`, `lang` (for `<html lang>`), `nav` (label and href pairs), `homePostCount`, `postsPerPage`, and the default OG image with its alt text. Pages read from here, never hard-coded strings, so a new user renames the blog in one place.

## SEO and link previews

`components/Seo.astro` writes the `<head>` metadata for every page, through `Base.astro`: `<title>`, description, canonical URL, Open Graph tags and `twitter:card` (Twitter/X falls back to the `og:` tags, so there are no other `twitter:*` tags). Every URL is absolute and includes the base path.

- Posts pass `article` (published and updated times, tags), so they get `og:type="article"` and `article:*` tags.
- A post with a hero image uses it as its preview, resized by `getImage()` to a 1200px-wide JPEG. Every other page uses `siteConfig.ogImage` from `public/`.
- That default, `public/og-image.png`, is generated to match LunarCSS's own social card: `python3 design/og-image.py` writes `design/og-image.svg` from the theme's geometry (update its colours and shapes when the theme's look changes), then either export it from Figma at 1x, as the theme does, or run `sh design/og-image-png.sh` to render it with headless Chrome and the packaged fonts. Update `ogImageAlt` if the picture changes.
- The 404 page passes `noindex`: it gets `<meta name="robots" content="noindex">` and no canonical URL.

## Markdown pipeline

- **GFM** (tables, task lists, strikethrough, footnotes) is on by default in Astro.
- **Syntax highlighting:** Astro's built-in Shiki at build time, with two themes, a light and a dark one (LunarCSS's showcase uses Catppuccin Latte and Mocha), and `defaultColor: false`. The tokens then carry `--shiki-light` / `--shiki-dark` custom properties instead of inline colours, and one rule in `site.css` picks between them with `light-dark()`, so highlighting follows the system's light or dark setting with no JS. `defaultColor: false` also keeps Shiki from painting a background on `pre`, so the theme's code block look stays. `wrap: null` drops Shiki's inline `overflow-x`, since the theme's `pre` scrolls on its own. The `site.css` rule targets `pre [style*="--shiki-light"]` (the token spans), and a second one gives them `CanvasText` in forced colours, because the theme opts `pre` out of forcing and that is inherited. Check the generated HTML after any Astro upgrade.
- **Footnotes:** GFM footnotes end up in a `section[data-footnotes]` at the end of the post, headed by an `h2` "Footnotes" with an `sr-only` class. We don't style classes, so the heading stays visible, and that's the decision: it's a reasonable heading on a blog, and screen readers use it too. To set them apart from the post, a small plugin in `astro.config.mjs` (`footnotesRule`) inserts an `<hr>` before the section, which the theme draws as its dotted band. To rename the heading, use Sätteri's `features.gfm.footnotes.label`.
- **Markdown processor:** Astro 7 renders Markdown and MDX with Sätteri, its own Rust-based processor, not remark/rehype. Plugins are Sätteri hast or mdast plugins, passed to `satteri()` from `@astrojs/markdown-satteri` as `markdown.processor`, and MDX inherits them. The old `markdown.rehypePlugins` and `markdown.remarkRehype` options are deprecated, and rehype plugins from npm don't work with Sätteri.
- **Heading anchors:** Astro adds `id`s to headings, so `#section` links work. There are no visible anchor links: a `#` link on each heading was tried and dropped, because the link chip didn't look right next to the headings. If it's ever revisited, note that Astro assigns heading ids after user plugins run, so a plugin that needs them has to run Astro's exported `satteriHeadingIdsPlugin()` first.
- **Images** in posts go through Astro's image pipeline (`sharp`), as long as they use Markdown's `![alt](./file.png)` syntax. Astro doesn't process a local image inside raw HTML in a `.md` file. Always provide alt text. Leave Astro's global responsive-image setting (`image.layout`) off: it adds an inline `style` to every image.
- **Captions:** Markdown has no caption syntax, so a captioned image needs MDX and the `Figure` component (`src`, `alt`, `caption` props; it outputs `figure > img + figcaption`). The caption is a prop, because MDX wraps child text on its own line in a `<p>`.
- **MDX:** `@astrojs/mdx`. The sample MDX post shows `Figure`; components must follow the no-classes rule too. The build prints a `MODULE_LEVEL_DIRECTIVE` warning (`"use astro:head-inject"`) for every MDX file. It's a harmless, open Astro bug ([withastro/astro#18087](https://github.com/withastro/astro/issues/18087)), and the only known exception to "no build warnings". Recheck it after Astro upgrades.

## Light and dark

The site follows the reader's system setting and has no theme toggle. LunarCSS's colours are `light-dark()` values, so the browser picks the mode from `prefers-color-scheme` with no JS, and there's nothing to flash on load. Never set `data-theme` on `<html>`: it would force one mode for everyone.

A toggle was built during the scaffold and dropped to keep the starter simple and free of JS. A user who wants one can add it: an inline `<head>` script that applies a saved `data-theme` before first paint, plus a button that flips and saves it (LunarCSS's `src/theme-toggle.js` is the model). Note that `<button hidden>` stays visible with the theme until [nikolaiwu/lunarcss#4](https://github.com/nikolaiwu/lunarcss/issues/4) is fixed.

To check both modes, switch the OS setting, or emulate `prefers-color-scheme` in the browser's dev tools.

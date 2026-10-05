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
│   ├── assets/               # logo.svg (the header logo, inlined by Astro);
│   │                         # moonrise.svg (an image two sample posts share);
│   │                         # icons/ (the archive's cards and list icons)
│   ├── layouts/
│   │   ├── Base.astro        # <html>, head, page shell (header, main, footer)
│   │   └── Post.astro        # a single post
│   ├── components/           # Figure, FormattedDate, PostCard, PostsHeader, Seo
│   │                         # (grids, pagination and tag links are inline)
│   ├── lib/
│   │   ├── url.ts            # url(): base-path-aware internal links
│   │   └── posts.ts          # published posts, newest first
│   ├── pages/
│   │   ├── index.astro       # intro and latest posts
│   │   ├── posts/[...page].astro  # archive as cards: /posts/, /posts/2/ …
│   │   ├── posts/list.astro  # archive as a list: /posts/list/
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

Post ids come from file names: `hello-world.md` and `hello-world/index.md` both give `hello-world`. Use the folder form when a post has its own images. A post id that's only a number would collide with an archive page (`/posts/2/`), and the id `list` with the list view (`/posts/list/`), so `getPosts()` in `src/lib/posts.ts` stops the build with an error naming the file. The check lives there, not in the schema, because the schema never sees the id and Astro's default id function isn't exported.

## Routes

- **`/`**: a short intro (from `site.config.ts`) and the latest `homePostCount` posts as a card grid, then a link to the archive.
- **`/posts/`**, **`/posts/2/`**…: the paginated archive as cards (`paginate()`, `postsPerPage` from config), with previous/next links in a `nav`.
- **`/posts/list/`**: the archive as a list, every post on one page as its title and date in a `ul`. Both archive views start with `PostsHeader`: the `h1` and a `nav` of two links, Card and List, each an icon and a label. They're links to two pages, not a switch, so there's no JS and the choice isn't remembered. The current view has `aria-current` (`page` on its own page, `true` on `/posts/2/` and later), which LunarCSS draws as the link's hover state. The icons are `currentColor` SVGs, hidden from screen readers since the label names the link. Rules in `site.css` put the links on the heading's row, centred on it (the header takes over the `h1`'s bottom margin, which would pull the centre line up), and make each link an `inline-flex` row that centres the icon on the label, with a gap.
- **`/posts/<id>/`**: the post, with previous/next links to its neighbours by date.
- **`/tags/`** and **`/tags/<tag>/`**: tag pages, not paginated in v1.
- **`/rss.xml`**: `@astrojs/rss`, title, description, date, tags (as categories) and link per post, plus an `atom:link rel="self"`, which feed validators ask for. Linked from `<head>` (`rel="alternate"`) and the footer. Pass `rss()` the blog's home URL as `site`, base path included, since it becomes the channel link: `context.site` alone is just the host. Item links come from `url()`.
- **`/about/`**: a Markdown page using the base layout.
- **`/404.html`**.
- **`/sitemap-index.xml`** (and `sitemap-0.xml`): `@astrojs/sitemap`, which needs `site` set. It includes the base path, leaves out the 404 page by itself, and only lists built pages, so drafts never appear. Linked from `<head>` (`rel="sitemap"`, through `url()`). Build only: `pnpm dev` doesn't serve it.

Every internal link must work under a `base` path (the demo is served from `/lunar-blog/`). Build URLs through `url()` in `src/lib/url.ts`, which prefixes `import.meta.env.BASE_URL`, and never hard-code a leading `/`. See [deploy.md](deploy.md).

In `Base.astro` the site title is a link straight in `body > header`, not a heading, so each page's own title is its only `h1`. The layout stylesheet only needs the `nav` in the header, not a heading.

### Logo

The site title link starts with the logo, `src/assets/logo.svg`: the favicon's accent box, widened, with its lines of writing. `Base.astro` imports it as an Astro SVG component, so it's inlined as an `<svg>`, with `aria-hidden="true"` since the title text right after it names the link. To use your own logo, replace the file; to drop it, delete the file and its import and `<Logo />` in `Base.astro`.

There's no CSS to size it, so the markup and the file itself have to be right:

- **The link is a direct child of the header.** The header is a flex row, so the link is laid out as a block, and its tint and accent underline cover the whole box, logo included. Don't wrap it in a `p` or `strong`: the link would be inline again, and its tint and underline would only cover the font's text box (about 1.28em in Space Grotesk), so a taller logo would stick out and the underline would cross it. The bold goes on the title text inside the link instead.
- **Inline `svg`, not `<img>`.** LunarCSS makes every `img` a block with a bottom margin, which would put the title under the logo. An inline `svg` sits in the line next to the title (the theme gives it `display: inline-block` and `vertical-align: middle`, so the title lines up with its middle) and gets no margin.
- **Sized in `em`.** It's `2em` tall, so it stays in proportion to the title at any font size. Set `width` in the file: the theme's `svg { height: auto }` overrides the `height` attribute, so the height comes from `width` and the `viewBox`'s proportions.
- **Its own colours.** The fills are fixed hex values (the accent and the dark page colour, as in `favicon.svg`), the same in light and dark mode. Presentation attributes can't read `var(--lunar-*)`. If you change `--lunar-accent`, change the logo's fill to match, or use `fill="currentColor"` for a logo that follows the text colour. On hover, the link's accent sweep fills in behind the logo, so the box merges into it and the lines stay.
- **No comments in the file.** Astro inlines the SVG as it is, so a comment would ship in every page.
- **One rule in `site.css`.** LunarCSS pads every link on both sides; `body > header > a:has(> svg:first-child)` drops the padding before the logo, so it sits flush with the start of the link's tint and lines up with the page content. The padding after the title stays, and if the logo is removed, the selector no longer matches and the link is padded as usual.

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
- **Wide tables:** LunarCSS scrolls a table sideways only inside an element that holds nothing but the table (or a `figure`), and Markdown outputs a bare `<table>`, so a wide one made the whole page scroll on a phone. A plugin in `astro.config.mjs` (`tableScroll`) wraps each table in a `div`, and the theme makes the `div` scroll. It skips a table that's already the only element in its parent, or in a `figure`, so raw HTML tables with their own wrapper aren't wrapped twice. The theme can't scroll a bare table: making the `table` itself a scroll box (`display: block`) stops it filling the width and can cost it its table semantics in screen readers.
- **Generated classes:** the Markdown output carries a few classes we never style: Sätteri's `contains-task-list` and `task-list-item` (task lists), `footnotes`, `sr-only` and `data-footnote-backref` (footnotes), and Shiki's `astro-code …` on `pre` and `line` on each code line. Sätteri has no setting to turn them off, and they're kept on purpose: they're the hooks Astro's docs and community snippets assume (a copy-code script looks for `pre.astro-code`), they give template users a way to restyle these parts, and stripping them would need a plugin that can break on Sätteri's 0.x API for no visible gain. Readers never pay for them: it's build-time HTML, a little over 1 kB on a code-heavy page before compression.
- **Markdown processor:** Astro 7 renders Markdown and MDX with Sätteri, its own Rust-based processor, not remark/rehype. Plugins are Sätteri hast or mdast plugins, passed to `satteri()` from `@astrojs/markdown-satteri` as `markdown.processor`, and MDX inherits them. The old `markdown.rehypePlugins` and `markdown.remarkRehype` options are deprecated, and rehype plugins from npm don't work with Sätteri.
- **Heading anchors:** Astro adds `id`s to headings, so `#section` links work. There are no visible anchor links: a `#` link on each heading was tried and dropped, because the link chip didn't look right next to the headings. If it's ever revisited, note that Astro assigns heading ids after user plugins run, so a plugin that needs them has to run Astro's exported `satteriHeadingIdsPlugin()` first.
- **Images** in posts go through Astro's image pipeline (`sharp`), as long as they use Markdown's `![alt](./file.png)` syntax. Astro doesn't process a local image inside raw HTML in a `.md` file. Always provide alt text. Leave Astro's global responsive-image setting (`image.layout`) off: it adds an inline `style` to every image.
- **Captions:** Markdown has no caption syntax, so a captioned image needs MDX and the `Figure` component (`src`, `alt`, `caption` props; it outputs `figure > img + figcaption`). The caption is a prop, because MDX wraps child text on its own line in a `<p>`.
- **MDX:** `@astrojs/mdx`. The sample MDX post shows `Figure`; components must follow the no-classes rule too. The build prints a `MODULE_LEVEL_DIRECTIVE` warning (`"use astro:head-inject"`) for every MDX file. It's a harmless, open Astro bug ([withastro/astro#18087](https://github.com/withastro/astro/issues/18087)), and the only known exception to "no build warnings". Recheck it after Astro upgrades.

## Light and dark

The site follows the reader's system setting and has no theme toggle. LunarCSS's colours are `light-dark()` values, so the browser picks the mode from `prefers-color-scheme` with no JS, and there's nothing to flash on load. Never set `data-theme` on `<html>`: it would force one mode for everyone.

A toggle was built during the scaffold and dropped to keep the starter simple and free of JS. A user who wants one can add it: an inline `<head>` script that applies a saved `data-theme` before first paint, plus a button that flips and saves it (LunarCSS's `src/theme-toggle.js` is the model). Note that `<button hidden>` stays visible with the theme until [nikolaiwu/lunarcss#4](https://github.com/nikolaiwu/lunarcss/issues/4) is fixed.

To check both modes, switch the OS setting, or emulate `prefers-color-scheme` in the browser's dev tools.

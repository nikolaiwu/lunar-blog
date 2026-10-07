# Contributing to Lunar Blog

Bug reports, fixes and improvements to the starter are welcome. For anything bigger, such as a new page type or a change to how posts are built, open an issue first so we can agree on the approach.

Lunar Blog is also the first real-world test of [LunarCSS](https://github.com/nikolaiwu/lunarcss), the classless theme it's styled with. When an element looks wrong, the fix usually belongs in the theme, not here: report it on [nikolaiwu/lunarcss](https://github.com/nikolaiwu/lunarcss/issues).

## Principles

1. **No classes in our markup.** Layouts, components, pages and posts use semantic elements, and LunarCSS styles them with element selectors. Generated markup (Shiki, footnotes, task lists) may carry classes, but we never style through them.
2. **Almost no CSS of our own.** `src/styles/site.css` stays small and unlayered, and every rule has a comment saying why the theme can't do it. No component `<style>` blocks, no inline `style`.
3. **Theme gaps go upstream.** If real content exposes something LunarCSS doesn't handle, the fix belongs in the theme. A workaround in `site.css` is temporary.
4. **Tokens, not values.** Any CSS we write uses `var(--lunar-*)` tokens, never raw colours or sizes.
5. **No third-party requests.** Fonts are self-hosted through the LunarCSS fonts stylesheet. No Google Fonts, analytics, embeds or CDN scripts in the template.
6. **Zero client JavaScript.** Light and dark follow the reader's system setting; there's no theme toggle, no UI framework islands and no view transitions.
7. **Every URL respects `base`.** Internal links and assets go through `url()` in `src/lib/url.ts`, so the blog works at a domain root and under a path like `/lunar-blog/`.

The comments in the code explain how each part works, and [CLAUDE.md](CLAUDE.md) sums up how the blog is built: where things are, writing posts, the markup the theme expects and the base path rule.

## Setup

You need Node.js 22.12+ and pnpm 12: the committed lockfile is pnpm's. Install it with `npm install -g pnpm@12` or `corepack install -g pnpm@12`. (People using the template can install it with any package manager: like Astro's own templates, `package.json` doesn't pin one.)

```bash
git clone https://github.com/nikolaiwu/lunar-blog.git
cd lunar-blog
pnpm install
pnpm dev
```

`pnpm dev` serves the blog with the sample posts at http://localhost:4321/lunar-blog/. Drafts show in dev and are left out of every build.

pnpm only runs the install scripts of dependencies listed under `allowBuilds` in `pnpm-workspace.yaml` (Astro needs `esbuild` and `sharp`). If an install fails with an ignored build script, add that package there.

## Commands

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Start the development server with hot reload |
| `pnpm build`        | Build the static site to `dist/`             |
| `pnpm preview`      | Serve the build, under the base path         |
| `pnpm check`        | Type-check the project (`astro check`)       |
| `pnpm format`       | Format all files with Prettier               |
| `pnpm format:check` | Check formatting without writing changes     |

Astro's dev server keeps running in the background after you close the terminal. Stop it with `pnpm astro dev stop`, and check on it with `pnpm astro dev status`.

## Fixing the theme

When an element looks wrong with real content, the fix usually belongs in [LunarCSS](https://github.com/nikolaiwu/lunarcss): open an issue there, or a pull request following its own CONTRIBUTING.md. The theme must stay generic, so a change that only makes sense for this blog belongs in `site.css`.

Until the fix is released, a small workaround in `site.css` is fine, with a comment linking the issue. Don't change the blog in a way that depends on an unreleased theme fix: `main` is what template users install, so it has to work with the published theme. Once the release is out, bump `@nikolaiwu/lunarcss` and remove the workaround.

## Making a change

### Markup

- Semantic elements first: `header`, `nav`, `main`, `article`, `aside`, `footer`, `time`, `figure`/`figcaption`. Keep heading levels in order on every page.
- `data-*` and ARIA attributes are fine as hooks (for example `aria-current`, or an `aria-label` on a second `nav`).
- Write markup that matches the patterns the theme and its layout stylesheet expect (page shell, card grid, full-page article), not CSS that fights them. See "Markup the theme expects" in [CLAUDE.md](CLAUDE.md).
- Watch the spaces between text and tags in `.astro` files. Astro drops the whitespace where a line of text ends and the next line starts with a tag or `{expression}`, so `or the` followed by `<a>` on the next line renders as "or the<a>". End such lines with `{" "}` (Prettier keeps it), or build the text as one string, and check the built HTML.

### `site.css`

- Unlayered, so it beats the theme's layers whatever the specificity. Never use `!important`.
- Every rule has a comment saying why it exists: a documented LunarCSS pattern, Shiki's colours, or a known theme gap.
- Values come from `var(--lunar-*)`. The exceptions are Shiki's `--shiki-light` / `--shiki-dark`, and CSS system colours (`CanvasText` and so on) inside `@media (forced-colors: active)`, the way the theme itself handles that mode.
- Structural selectors only, no classes.

### Dependencies

Keep them few: `astro`, `@nikolaiwu/lunarcss`, `@astrojs/mdx`, `@astrojs/markdown-satteri` (Astro's Markdown processor, installed to pass it plugins), `@astrojs/rss`, `@astrojs/sitemap`, `sharp` (Astro's image service; under pnpm it has to be a direct dependency), and the dev tooling. Every extra dependency is something template users inherit and have to maintain, so discuss one in an issue before adding it.

### Accessibility

- Visible focus comes from the theme, so don't remove outlines.
- Images need alt text; the schema enforces it for hero images.
- Check contrast in light and dark. The site follows the system setting, so switch it in the OS or emulate `prefers-color-scheme` in the browser's dev tools.
- Check each page you changed with the keyboard, and in forced colours (Windows contrast themes, or the dev tools emulation) if you can.

### Before you open a pull request

- Run `pnpm format`, `pnpm check` and `pnpm build`.
- Check the change with `pnpm build && pnpm preview`, which serves under the base path: a hard-coded `/posts/…` works in dev and breaks there.
- Look at it in light and dark mode, at phone width (360px, with no sideways page scroll), in Chrome, Firefox and Safari.
- Keep the code comments, [CLAUDE.md](CLAUDE.md) and this file in step when how something works changes.
- Add a line under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md).

## Pull requests

1. Fork the repository and create a branch (`git checkout -b fix-tag-page-title`).
2. Commit your changes, with a message that says what changed and why.
3. Push the branch and open a pull request against `main`.

## Project structure

```
lunar-blog/
├── astro.config.mjs          # site, base, integrations, Markdown and Shiki config
├── src/
│   ├── site.config.ts        # title, description, author, language, navigation…
│   ├── content.config.ts     # the posts collection and its schema
│   ├── content/posts/        # sample posts (.md and .mdx), co-located images
│   ├── assets/               # logo.svg (the header logo, inlined by Astro),
│   │                         # moonrise.svg (shared by two sample posts),
│   │                         # icons/ (the archive's cards and list icons)
│   ├── layouts/
│   │   ├── Base.astro        # <html>, head, page shell (header, main, footer)
│   │   └── Post.astro        # a single post
│   ├── components/           # Figure, FormattedDate, PostCard, PostsHeader, Seo
│   ├── lib/
│   │   ├── url.ts            # url(): base-path-aware internal links
│   │   └── posts.ts          # published posts, newest first, and tags
│   ├── pages/
│   │   ├── index.astro       # intro and latest posts
│   │   ├── posts/[...page].astro  # archive as cards: /posts/, /posts/2/ …
│   │   ├── posts/list.astro  # archive as a list: /posts/list/
│   │   ├── posts/[id].astro  # a post: /posts/<id>/
│   │   ├── tags/index.astro  # every tag with its post count
│   │   ├── tags/[tag].astro  # the posts with that tag
│   │   ├── about.md          # a standalone Markdown page
│   │   ├── 404.astro
│   │   ├── rss.xml.ts
│   │   └── robots.txt.ts
│   └── styles/site.css       # the small unlayered stylesheet
├── public/                   # favicon.svg, apple-touch-icon.png, og-image.png
├── .github/
│   ├── workflows/pages.yml   # deploys to GitHub Pages on pushes to main
│   └── screenshot.png        # the README's screenshot
├── CHANGELOG.md
├── CLAUDE.md                 # guidance for Claude Code
└── CONTRIBUTING.md
```

## Releasing

For maintainers. The template is the repo, with no npm package: `npm create astro@latest -- --template nikolaiwu/lunar-blog` downloads `main` as it is, so `main` must always build, with the lockfile committed.

1. Test the real install in a temporary folder: `npm create astro@latest -- --template nikolaiwu/lunar-blog`, then `npm install && npm run build && npm run dev`. Do this before every release, and after any change to `package.json` or the config.
2. Move the `[Unreleased]` notes in `CHANGELOG.md` under a new version heading, and commit.
3. Tag the commit `vX.Y.Z` and push it with `git push --follow-tags`.
4. Create a GitHub release from the tag, with that version's changelog section as its notes.

# Brief

## Why this exists

LunarCSS is a classless theme: the CSS stays MIT and free, and the plan is to build polished sites on top of it. This starter is phase 1 of that plan:

1. **Adoption.** A "write Markdown, get this look" starter is the easiest way to try the theme. The Astro themes directory and `create astro --template` are permanent places where people can find it.
2. **Testing the theme.** Real posts (footnotes, long code blocks, heading anchors, tables, a table of contents) will show gaps the showcase doesn't. Fixing them in LunarCSS is part of the job, and a real site using the theme is a requirement for its 1.0 release.
3. **Measuring demand.** Stars, template installs and directory traffic over 1–2 months decide whether paid templates (portfolio, landing page, docs) are worth building. Build this one well enough that those templates can reuse its structure.

## Why Astro (settled — don't reopen)

- **Static HTML by default, with zero JS shipped.** A classless theme needs clean semantic HTML and nothing else. Next.js ships a React runtime, which a blog doesn't need.
- **Markdown/MDX and content collections are built in**: typed frontmatter, `getCollection()`, and `render()`. In Next.js the same thing takes MDX loaders plus a content library.
- **Output is plain `dist/`**, so it deploys to GitHub Pages or any static host with no server and no adapter.
- **Distribution:** the Astro themes directory lists free and paid themes, and `npm create astro@latest -- --template user/repo` installs straight from GitHub.

## In scope (v1)

- Markdown and MDX posts in a content collection, with a typed schema: title, description, publish date, updated date, tags, draft, optional hero image
- Home page: the site intro and a card grid of the latest posts
- Post archive with pagination
- Post page: title, dates, tags, content, previous/next links
- Tag index and a page per tag
- RSS feed, sitemap, and a 404 page
- An about page as the example of a standalone page
- Light and dark modes that follow the reader's system setting, with no JS and no flash on load
- LunarCSS theme, fonts and layout stylesheets, all self-hosted through npm
- Syntax highlighting that follows light/dark (build time, no JS)
- SEO basics: `<title>`, description, canonical URL, Open Graph and Twitter tags, an OG image
- One config file (`src/site.config.ts`) for the site title, description, author, nav links and posts per page
- Sample posts that double as the demo, including one "every Markdown element" post that shows the theme's coverage
- A README with screenshots, a one-command install, and customization docs (tokens, fonts, removing sample content)

## Out of scope for v1

- Client-side search, comments, newsletter forms, analytics (all of these add third-party requests or JS)
- i18n, multiple authors, series or collections beyond tags
- A light/dark toggle. The site follows the system setting, which keeps it free of JS. (Tried during the scaffold and dropped to keep it simple; LunarCSS supports one through `data-theme` if a user wants to add it.)
- UI framework integrations (React, Vue, Svelte) and view transitions
- Tailwind or any other CSS framework
- Paid features. This repo stays free and MIT; paid templates go in a separate private repo later

Nice to have, if they come cheap: reading time, a table of contents on long posts, per-post OG images generated at build time.

## Milestones

1. **Scaffold:** Astro project, LunarCSS imports, base layout with the page shell, Prettier. `pnpm dev` and `pnpm build` both work.
2. **Content:** the collection schema, sample posts, and the post page with syntax highlighting.
3. **Navigation:** home, archive with pagination, tag pages, previous/next, 404, about.
4. **Feeds and SEO:** RSS, sitemap, meta tags, OG image.
5. **Theme pass:** review every page in light and dark and on a phone, fill in `docs/theme-gaps.md`, and fix what belongs upstream in LunarCSS (a separate repo at `../lunarcss`).
6. **Ship:** README, screenshots, GitHub Pages demo, tested `create astro --template` install, a `v1.0.0` tag.
7. **List it:** Astro themes directory submission, and links from the LunarCSS README and showcase. Both are outward-facing, so do them only when the user asks.

## Definition of done

- `pnpm build` passes with no warnings, and `pnpm astro check` is clean
- No `class=` in any `.astro` or `.mdx` file we wrote (`grep -rn 'class=' src/` only finds generated or commented cases)
- The built site loads nothing from other origins (check the network panel)
- No JS on the page at all (no `<script>` in the built HTML)
- Lighthouse 100 for accessibility, best practices and SEO on the home and post pages
- It works at 360px width with no horizontal page scroll (tables and `pre` scroll inside themselves)
- A fresh `npm create astro@latest -- --template nikolaiwu/lunar-blog` install builds and runs

## Open questions

- **Maintainer docs in the template.** `create astro --template` copies the whole repo, so this CLAUDE.md and `docs/` would reach every user. They get rewritten for users before v1.0.0; the task list is in `PUBLISHING.local.md`, section 0.6. Ask the user about what ships. The image generators that were in `design/` have moved to the LunarCSS repo (`design/lunar-blog/`), so they no longer ship.
- **Repo name.** `lunar-blog` is the working name. Changing it touches the install command, the Pages `base` path and the README.

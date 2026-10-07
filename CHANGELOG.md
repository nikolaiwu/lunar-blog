# Changelog

All notable changes to Lunar Blog are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

The first release: an Astro blog starter styled by LunarCSS, with no classes and no client JavaScript.

### Added

**Setup**

- Astro 7, with `dev`, `build`, `preview`, `check`, `format` and `format:check` scripts, the strict TypeScript preset, and Prettier with the Astro plugin
- Installs with any package manager (npm, pnpm, yarn or bun): `package.json` doesn't pin one, as Astro's own templates don't, and approves esbuild's install script for npm (`allowScripts`)
- `src/site.config.ts`: the site title, description, author, language, navigation, post counts and default preview image in one place
- `site` and `base` read from the `SITE_URL` and `BASE_PATH` environment variables, defaulting to the GitHub Pages demo at `https://nikolaiwu.github.io/lunar-blog/`, so the blog works at a domain root or under a path
- A GitHub Actions workflow that deploys to GitHub Pages on every push to `main`, built on Astro's deploy action. It gets the site's address from GitHub, so it works for a project site, a user site or a custom domain without changes, and installs with whichever package manager's lockfile is in the repo

**Posts**

- A `posts` content collection with a typed schema: title, description, dates, tags (lower-case slugs, checked), drafts that show only in dev, and a hero image with required alt text
- Markdown and MDX, with a classless `Figure` component for images with captions
- Syntax highlighting at build time with GitHub Light High Contrast and Catppuccin Mocha, following the system's light or dark mode. The light theme is chosen for readable contrast on LunarCSS's code background
- Wide tables scroll sideways on their own instead of making the whole page scroll: each Markdown table is wrapped in a `div`, which LunarCSS scrolls
- A horizontal rule between a post and its footnotes
- Task list items marked `[ ]` and `[x]`, with the checkbox kept for screen readers
- Nine sample posts about building LunarCSS (one a draft), including an "Every Markdown element" reference post and an MDX post

**Pages**

- Home page: the site intro and the latest posts as a card grid
- Post archive as cards at `/posts/`, `/posts/2/` and so on, and as one list at `/posts/list/`, with icon links beside the heading to switch views
- Post pages at `/posts/<id>/`: the title with the dates and tags on one line under it, a responsive hero image, the post, and links to the newer and older posts after a rule
- Tag pages: `/tags/` lists every tag with its post count, and `/tags/<tag>/` shows that tag's posts
- An About page in plain Markdown (`src/pages/about.md`), as the example of a standalone page, and a 404 page

**Look**

- LunarCSS with its self-hosted fonts and layout stylesheet, and one small stylesheet of our own (`src/styles/site.css`), each rule commented
- Light and dark modes that follow the reader's system setting, with no JavaScript
- A header with a logo (`src/assets/logo.svg`, inlined and sized in `em`), the site title and navigation that marks the current page; a footer that stays at the bottom of short pages
- A favicon and an Apple touch icon: LunarCSS's accent box with a cut corner, holding a few lines of writing

**Feeds and SEO**

- An RSS feed at `/rss.xml`, linked from every page's `<head>` and footer
- A sitemap at `/sitemap-index.xml`, and a `robots.txt` that points to it
- Canonical URLs, Open Graph and a Twitter card on every page. Posts use their hero image as the preview; other pages use `public/og-image.png`, which matches LunarCSS's social card. The 404 page is kept out of search results

**Docs**

- README, with a light and dark screenshot of the home page: install, features, getting started (with the frontmatter reference), customizing, deploying and credits
- `CLAUDE.md` for building your blog with Claude Code: how the starter is built, where things are, making it yours, posts and pages, the markup the theme expects, deploying, customizing, and where to report problems
- `CONTRIBUTING.md`: principles, setup, commands, fixing the theme, conventions, the project structure and the release steps
- MIT license

[Unreleased]: https://github.com/nikolaiwu/lunar-blog/commits/main

# Changelog

All notable changes to Lunar Blog are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Astro 7 project setup: `dev`, `build`, `preview`, `check`, `format` and `format:check` scripts, the strict TypeScript preset, and Prettier with the Astro plugin
- `site` and `base` are read from the `SITE_URL` and `BASE_PATH` environment variables, defaulting to the GitHub Pages demo at `https://nikolaiwu.github.io/lunar-blog/`
- MIT license
- `src/site.config.ts`: the site title, description, author, language, navigation and post counts in one place
- Base layout with the LunarCSS theme, fonts and layout stylesheet, a header with the site title and navigation, and a footer
- Light and dark modes that follow the reader's system setting, with no JavaScript
- A `posts` content collection with a typed schema (title, description, dates, tags, drafts, hero image with required alt text)
- Eight sample posts about building LunarCSS, plus a draft, including an "every Markdown element" reference post and an MDX post
- MDX support, and a classless `Figure` component for images with captions
- A horizontal rule between a post and its footnotes
- Syntax highlighting at build time with Catppuccin Latte and Mocha, following the system's light or dark mode, with no JavaScript
- Home page: the site intro and the latest posts as a card grid, with a `PostCard` component shared by every list of posts
- Post archive at `/posts/`, `/posts/2/` and so on, `postsPerPage` cards per page, with newer and older page links
- Tag pages: `/tags/` lists every tag with its post count, and `/tags/<tag>/` shows that tag's posts. Tags must be lower-case slugs such as `dark-mode`, which the schema checks
- An RSS feed at `/rss.xml`, linked from every page's `<head>` and footer
- A sitemap at `/sitemap-index.xml`, and a `robots.txt` that points to it
- A logo in the header, before the site title: `src/assets/logo.svg`, inlined and sized in `em` to match the title
- A favicon and an Apple touch icon: LunarCSS's accent box with a cut corner, holding a few lines of writing
- A default link preview image, `public/og-image.png`, matching LunarCSS's social card, with its generator in `design/`
- Link previews and SEO tags on every page: canonical URL, Open Graph and a Twitter card. Posts use their hero image as the preview when they have one; the 404 page is kept out of search results
- An About page in plain Markdown (`src/pages/about.md`), as the example of a standalone page
- A 404 page
- Post pages at `/posts/<id>/`: title, published and updated dates, tags, a responsive hero image, the post, and links to the newer and older posts
- Local theme mode: `LUNARCSS_LOCAL=../lunarcss pnpm dev` compiles the theme from a LunarCSS checkout's SCSS source, for working on the theme and the blog together

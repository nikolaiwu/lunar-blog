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
- Local theme mode: `LUNARCSS_LOCAL=../lunarcss pnpm dev` compiles the theme from a LunarCSS checkout's SCSS source, for working on the theme and the blog together

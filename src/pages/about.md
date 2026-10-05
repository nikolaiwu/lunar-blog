---
layout: ../layouts/Base.astro
title: About
description: What Lunar Blog is, and how to make it your own.
---

# About

Lunar Blog is a free Astro starter for a personal blog. You write posts in Markdown or MDX, Astro turns them into plain, semantic HTML, and [LunarCSS](https://nikolaiwu.github.io/lunarcss/) styles that HTML without a single class. There's no JavaScript on the page, and nothing is loaded from other sites: the fonts are served with the rest of the blog.

The posts here are samples, all about how LunarCSS was built. They double as a demo of what the theme covers, so [Every Markdown element](../posts/every-markdown-element/) is a good place to start.

## Make it yours

1. Change the title, description, author, language and navigation in `src/site.config.ts`.
2. Delete the sample posts in `src/content/posts/`, and write your own.
3. Rewrite this page: it's `src/pages/about.md`, plain Markdown with the base layout.
4. To change the colours, set LunarCSS tokens such as `--lunar-accent` in `src/styles/site.css`.

## Built with

- [Astro](https://astro.build), which builds the site into static HTML
- [LunarCSS on GitHub](https://github.com/nikolaiwu/lunarcss), the classless theme
- [Space Grotesk and Space Mono](https://github.com/floriankarsten/space-grotesk), under the SIL Open Font License

This page is also the example of a standalone page: any Markdown file in `src/pages/` becomes a page at its own URL.

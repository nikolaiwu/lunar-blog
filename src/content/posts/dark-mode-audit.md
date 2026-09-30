---
title: Notes for a dark-mode audit
description: A sample draft. It shows in pnpm dev so you can preview it, and never in the built site.
pubDate: 2026-10-01
tags: [dark-mode]
draft: true
---

This is a sample draft. Posts with `draft: true` in their frontmatter show up while you run `pnpm dev`, so you can preview them, and are left out of every build. Set `draft: false`, or remove the line, to publish it.

Things to check in dark mode:

- Code blocks switch their highlighting colours along with the page
- Images with transparent backgrounds still read against the dark page
- Muted text keeps enough contrast

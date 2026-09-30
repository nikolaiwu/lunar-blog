---
title: Fonts without a request to Google
description: The theme never downloads a font. An optional stylesheet self-hosts Space Grotesk and Space Mono, and everything else falls back to system fonts.
pubDate: 2026-09-15
tags: [fonts, css]
---

LunarCSS is set in Space Grotesk, with Space Mono for code and labels. But the theme stylesheet itself never downloads a font. Its font tokens name the two families first and then fall back to system fonts:

```css
:root {
  --lunar-font-sans:
    "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  --lunar-font-mono:
    "Space Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
    "Liberation Mono", monospace;
}
```

If the fonts aren't available, the page uses the reader's system fonts and still looks fine.

## The optional fonts stylesheet

To get the real typefaces, load the fonts stylesheet before the theme. It declares both families with `@font-face` rules pointing at font files that ship with the package: woff2 only, split into subsets by alphabet (Latin, Latin Extended, Vietnamese and so on), so a browser downloads only the subsets a page actually needs.

The files are served from your own site, like the rest of your CSS. There's no request to Google Fonts or any other font service, so no third party learns who visits your pages.

This blog does exactly that, and its build copies the font files next to its own stylesheet. Both fonts are licensed under the SIL Open Font License.

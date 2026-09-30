---
title: One set of colours for light and dark
description: LunarCSS defines each colour once with light-dark(), mixes the rest at runtime in oklch, and lets you retheme it by changing two tokens.
pubDate: 2026-09-15
tags: [css, dark-mode]
---

Most themes that support dark mode keep two copies of their colours: one set of variables for light, another for dark, swapped by a media query or a class on `<html>`. LunarCSS keeps one.

## light-dark()

Each colour token holds both values at once:

```css
:root {
  color-scheme: light dark;

  --lunar-bg: light-dark(var(--lunar-light), var(--lunar-dark));
  --lunar-fg: light-dark(var(--lunar-dark), var(--lunar-light));
}
```

`light-dark()` returns its first value when the element's `color-scheme` is light and its second when it's dark. With `color-scheme: light dark` on the root, the browser picks from the reader's system setting. No media query, no JavaScript and no second set of variables.

To force a mode, set `data-theme="light"` or `data-theme="dark"` on `<html>`. The theme turns that into a `color-scheme`, and every `light-dark()` value flips at once. `color-scheme` is inherited, so it works on any element: a dark `aside` on a light page is one attribute.

## Two main colours

The whole palette hangs off two tokens, `--lunar-light` and `--lunar-dark`. The background and text colours swap between them, and the muted colour is mixed from both:

```css
:root {
  --lunar-muted-mix: 50%;
  --lunar-muted: light-dark(
    color-mix(
      in oklch,
      var(--lunar-light),
      var(--lunar-dark) var(--lunar-muted-mix)
    ),
    color-mix(
      in oklch,
      var(--lunar-dark),
      var(--lunar-light) var(--lunar-muted-mix)
    )
  );
}
```

The mixing happens in the browser, not in Sass. So when you override the main colours, everything mixed from them follows:

```css
:root {
  --lunar-light: #faf9f7;
  --lunar-dark: #1c1917;
  --lunar-muted-mix: 65%;
}
```

That's a warmer theme in three lines.

## Why oklch

Every mix in the theme uses `oklch`. It's a colour space built to match how bright colours look to people, so a 50% mix between two colours looks halfway between them. Mixing in `srgb` gives muddier, uneven results, which is why the theme never does.

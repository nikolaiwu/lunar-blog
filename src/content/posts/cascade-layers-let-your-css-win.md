---
title: Cascade layers let your CSS win
description: LunarCSS wraps the whole theme in one cascade layer, so a site's own CSS overrides it without specificity fights or !important.
pubDate: 2026-09-16
tags: [css, layers]
---

Every CSS theme runs into the same problem sooner or later. You want to change one thing, say the colour of a button, and the theme's selector is more specific than yours. So you add a class, then a parent selector, then `!important`, and the stylesheet slowly turns into a fight.

LunarCSS avoids that fight with cascade layers.

## One layer for the whole theme

The theme's entry point wraps every rule in a single layer:

```scss
@layer lunarcss {
  @include meta.load-css("config");
  @include meta.load-css("reset");
  @include meta.load-css("elements/buttons");
  // …every other partial
}
```

Sass's `@use` can't be nested inside `@layer`, so the partials are loaded with `meta.load-css()` instead. The order of those lines is the cascade order.

## Why that's enough

When the browser decides between two conflicting declarations, it compares their layers before it looks at specificity. Styles that aren't in any layer beat all layered styles. So this, in your own stylesheet:

```css
button {
  background-color: rebeccapurple;
}
```

wins over the theme's button rule, even though that rule is written with more specific selectors, and even though your stylesheet might load before the theme. No `!important`, no extra class.

The same goes for later layers. A framework that puts its utilities in a layer declared after `lunarcss`, as Tailwind v4 does, overrides the theme too.

## The layout layer

The optional layout stylesheet has a layer of its own, `lunarcss-layout`. Layers are ordered by when they first appear, so the theme must load before the layout stylesheet. Then the layout wins over the theme where they overlap, and your unlayered CSS wins over both.

## The one exception

Layers flip the rule for `!important`: an important declaration in an earlier layer beats an important one in a later layer or outside any layer. The theme uses that in exactly one place, its reduced-motion rule, so that nothing can turn animations back on for a reader who asked for less motion. Everywhere else, the theme relies on the layer and never on `!important`.

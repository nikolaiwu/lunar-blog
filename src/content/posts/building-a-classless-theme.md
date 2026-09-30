---
title: Building a classless theme, element by element
description: How LunarCSS styles plain HTML with element selectors only, where its decoration comes from when an element has nothing to draw with, and what it gives up to stay out of your way.
pubDate: 2026-09-29
updatedDate: 2026-09-30
tags: [css, design, lunarcss]
---

LunarCSS 0.1.0 came out on 29 September. It's a classless theme: you write plain, semantic HTML, link one stylesheet, and every standard element comes out styled. There are no `.btn-primary` classes to remember, no utility soup and no component library. This post walks through how that works, and the handful of rules that shaped almost every decision along the way.

## The one rule

Every rule in the theme selects an element: `button`, `article`, `ul > li`, `thead th`. Attribute selectors and pseudo-classes are fine, so `a[target="_blank"]`, `input[type="checkbox"]` and `:focus-visible` all appear. Class selectors never do.

That sounds like a style preference, but it's really a promise about markup. If the theme only ever looks at elements, then any HTML that's correct is also styled, whether it came from a Markdown renderer, a CMS, a server template or someone typing it by hand. Nothing has to know about the theme.

The rule has a cost. Every element gets exactly one look, because there's nothing to switch on. A classless theme can't offer a "primary" and a "secondary" button, so it has to pick one design that works everywhere, and let context do the rest.

### Where the rule is tested

The theme repo has two pages. The showcase documents every element next to its source, and it's allowed to use classes for its own layout. The Acme Robotics demo is a fictional company's landing page, and it isn't: no `class` attributes, no inline styles, no page CSS. If the demo can't express something, the theme is missing it, and the fix goes into the theme.

This blog is the second test of the same kind, with real posts instead of a landing page.

## Where the decoration comes from

A classless theme can't add wrapper elements, so everything it draws has to fit on the element itself. That leaves three places to draw:

1. The element's own box: its border, background and outline.
2. Its `::before` and `::after` pseudo-elements.
3. Its background layers, as many as you like, stacked in one `background-image` list.

### Pseudo-elements, until they run out

Pseudo-elements are the obvious choice, and the theme uses them a lot: the heading marks, the list ticks, the blockquote panel, the new-tab arrow on links. The catch is that there are only two per element, and some elements need both for one effect. A card's cut-corner border takes `::before` for the border shape and `::after` for the fill, so a card has none left over.

The User Guide lists every pseudo-element the theme uses, so a site knows which ones are free.

### Backgrounds, for elements with no pseudo-elements

Form controls are the hard case. `input` is a void element, and void elements don't render `::before` or `::after` at all. `textarea` and `select` don't either. So everything on a form control is a background layer.

A checkbox, for example, is drawn entirely on the element with `appearance: none`. Its knob is a gradient moved with `background-position`, and its colour goes through `color`, because gradients can't transition and `color` can. A radio's fill is a `conic-gradient` whose stop is a registered custom property:

```css
@property --lunar-radio-fill {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
```

Registering it with `@property` gives it a type, and a typed property can be animated. That's what makes the radio fill sweep round instead of snapping.

## Cutting corners

The theme's signature shape is a box with 45° corners cut off. There are two ways to draw one, and the theme needs both.

### Clipping the element

The simple way is `clip-path` on the element itself. Buttons, `pre` blocks and `mark` do this. It works on void elements too, which is why input buttons get the same cut as `<button>`.

Clipping has a side effect: it clips everything the element draws, including its outline. A focus ring on a clipped button would lose its corners, so buttons show focus differently. The edge turns the text colour and doubles in width, drawn inside the shape where the clip can't reach it.

### A border along the diagonal

`clip-path` can cut a box, but it can't draw a border along the cut. For cards, which need a visible border all the way round, the theme uses two pseudo-elements: `::before` is the border shape, and `::after` is the fill, inset by the border width. The inner cut has to be smaller than the outer one to keep the diagonal border the same thickness as the straight edges. It works out to the cut size minus the border width times 0.5858, which is 2 − √2.

## Spacing without a sibling rule

A lot of classless stylesheets space things with one rule, something like `* + * { margin-top: 1rem }`. LunarCSS doesn't. Each element carries its own bottom margin, and vertical margins collapse, so the space between two elements is the larger of the two.

There's one exception. A section's last paragraph has no bottom margin and headings have no top margin, so two sections in a row need a gap of their own: `section + section` gets a top margin that matches the layout stylesheet's gap.

The generic rule would also have broken the card grid. Grid cards are flex columns, and margins in a flex container don't collapse, so a sibling rule would double every gap inside a card.

## Staying out of your way

### Everything in one layer

The whole theme sits in a single cascade layer, `@layer lunarcss`. A site's own CSS, if it isn't in a layer, beats every layer whatever the specificity. So a one-line override in your stylesheet wins over the theme's most specific selector, without `!important`. [Cascade layers let your CSS win](../cascade-layers-let-your-css-win/) covers this in more detail.

### Styling, not placing

The theme styles elements but never places them. It doesn't pad the `body`, centre the page or lay out a header, because those are decisions about a particular page, and a page with its own layout shouldn't have to undo them.

Page structure lives in an optional second stylesheet, in its own `lunarcss-layout` layer. It turns `body > header` with a `nav` into a title-and-links row, `main` next to `aside` into a sidebar, and any element whose children are all `article`s into a card grid:

```css
:has(> article + article):not(:has(> :not(article))) {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, var(--lunar-card-min-width)), 1fr)
  );
}
```

That selector reads as "an element with at least two `article` children, and no child that isn't an `article`". Put a heading inside the wrapper and the grid turns off, which is why this blog keeps headings outside its card lists.

## Accessibility is part of the look

Some decisions only make sense once you check the page in more than one setting.

- **Forced colours.** Windows contrast themes swap every colour for the user's system palette and drop background images. Much of the theme is drawn with backgrounds, so without help, a checkbox's knob, a progress bar's fill and a card's border would simply disappear. [Drawing with backgrounds in forced colours](../drawing-with-backgrounds-in-forced-colours/) is about how the theme handles it.
- **Reduced motion.** When the reader asks for less motion, every transition and animation is cut to almost nothing, including the `details` open and close.
- **List semantics.** The native bullet is hidden with `list-style-type: ""` rather than `list-style: none`, because Safari drops a list's semantics for VoiceOver when its style is `none`.

## Printing

Pages print in the light theme, since dark mode would put light text on white paper. Code blocks wrap instead of scrolling, and cards, figures, code, quotes, table rows and images avoid breaking across pages.

## What it adds up to

The result is one stylesheet of about 10 kB gzipped, plus the optional layout and fonts stylesheets, and a rule that's easy to check: a `grep` for `class=` in a site's templates should find nothing. This blog is the first real site built on it, and every place where its posts look wrong is a gap to fix in the theme.

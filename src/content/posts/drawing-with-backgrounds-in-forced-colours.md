---
title: Drawing with backgrounds in forced colours
description: Windows contrast themes remove background images, and much of LunarCSS is drawn with them. Three fixes keep the theme's shapes visible in the reader's own colours.
pubDate: 2026-09-21
tags: [accessibility, css]
---

Windows contrast themes, and Firefox's setting to override page colours, switch on a mode called forced colours. The browser replaces the page's colours with the reader's system palette, removes every `background-image` that isn't an image file, and drops box shadows. It's there for people who need strong, predictable contrast, and a theme should keep working in it.

That's a problem for LunarCSS, because much of it is drawn with backgrounds. Form controls give a theme nothing else to draw with, so a checkbox's knob, a progress bar's fill and a card's border are all background layers. Without help, they'd simply disappear.

## Three fixes

The theme handles this in one file, loaded last so it wins over the element rules.

**The colour tokens point at system colours.** Anything drawn with the tokens now follows the reader's palette:

```css
@media (forced-colors: active) {
  :root {
    --lunar-bg: Canvas;
    --lunar-fg: CanvasText;
    --lunar-border: CanvasText;
    --lunar-accent: Highlight;
  }
}
```

**Decoration drawn with backgrounds opts out of forcing.** `forced-color-adjust: none` tells the browser to leave an element's backgrounds alone. Since those backgrounds are now painted with system colours from the tokens above, they keep their shape and still match the reader's palette.

**Focus falls back to a real outline.** The theme's own focus cues are accent borders, inset shadows and growing brackets, and forced colours flattens or removes most of them. So every focusable control gets a plain outline in the system `Highlight` colour.

## Buttons are the exception

Buttons have their corners cut with `clip-path`. In forced colours the theme drops the clip instead of fighting it, and buttons become plain bordered rectangles. The cut would leave gaps in the border, and it would cut off the focus outline, so a simple shape is the more usable one here.

## Checking it

Edge and Chrome can emulate forced colours in the developer tools, under Rendering. It's worth a look on any page that draws with backgrounds, not just this theme.

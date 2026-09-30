# Theme gaps

Places where real blog content exposes something LunarCSS doesn't handle yet. One entry each: what triggers it, what goes wrong, what we do meanwhile, and where it stands upstream. Remove an entry once a released LunarCSS version fixes it and the starter has upgraded.

Statuses: **suspected** (not checked yet) · **confirmed** · **workaround in site.css** · **issue filed** (link) · **fixed in vX.Y.Z**.

## Seeded from the plan (check each one)

These came from the LunarCSS promotion plan, before any code existed.

- **Full-page article is drawn as a card**: workaround in site.css. Any `article` is a card, so `main > article` for a post is boxed. `site.css` has the User Guide's reset ("Full-page articles") until the theme handles it. The theme could offer this itself (e.g. `main > article` without the card, or a card only inside a grid).
- **Footnotes**: suspected. GFM footnotes produce `sup > a` references, a `section[data-footnotes]` with a heading carrying `sr-only`, and back-reference links (`↩`). The visible "Footnotes" heading is kept on purpose, and an `<hr>` now separates the notes from the post (see [architecture.md](architecture.md)). Still to check: the reference size, and the back-links against the link chip style.
- **Heading anchors**: suspected. Anchor links inside or next to `h2`/`h3` may clash with the heading's slanted-bar mark (`::before`) and the link chip.
- **Long code blocks**: suspected. Check very long lines (sideways scroll, focus state), very tall blocks, and Shiki's token colours against the theme's `pre` background in both modes.
- **Table of contents**: suspected. A nested `ul` of links (in the `aside`, or at the top of a post) gets tick bullets that grow with nesting. Check whether that reads well as a TOC.
- **Tag lists**: suspected. Tags on a card or post are a short list of links. A `ul` has tick bullets and a vertical layout, so there may be no classless way to lay out an inline tag row except `nav > ul` (which is wrong semantically).

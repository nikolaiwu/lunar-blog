# Theme gaps

Places where real blog content exposes something LunarCSS doesn't handle yet. One entry each: what triggers it, what goes wrong, what we do meanwhile, and where it stands upstream. Remove an entry once a released LunarCSS version fixes it and the starter has upgraded.

Statuses: **suspected** (not checked yet) · **confirmed** · **workaround in site.css** · **issue filed** (link) · **fixed in vX.Y.Z**.

## Found while building (check in the theme pass)

- **Wide Markdown tables**: suspected. The theme scrolls a wide table sideways only inside a wrapper that holds nothing but the table, and Markdown outputs a bare `<table>` (see the wide table in "Every Markdown element"). At 360px it will probably make the whole page scroll sideways. If confirmed, it's a starter fix, not a theme gap: a Sätteri hast plugin in `astro.config.mjs` that wraps each `table` in a `div`, like `footnotesRule`.
- **Task list checkboxes**: suspected. GFM task lists render `<input type="checkbox" disabled>` inside `li`s (with a `task-list-item` class we don't style), so each item gets the theme's tick bullet and its vertical-switch checkbox. Check that it reads as a checklist.

## Seeded from the plan (check each one)

These came from the LunarCSS promotion plan, before any code existed.

- **Full-page article is drawn as a card**: workaround in site.css. Any `article` is a card, so `main > article` for a post is boxed. `site.css` has the User Guide's reset ("Full-page articles") until the theme handles it. The theme could offer this itself (e.g. `main > article` without the card, or a card only inside a grid).
- **Footnotes**: suspected. GFM footnotes produce `sup > a` references, a `section[data-footnotes]` with a heading carrying `sr-only`, and back-reference links (`↩`). The visible "Footnotes" heading is kept on purpose, and an `<hr>` now separates the notes from the post (see [architecture.md](architecture.md)). Still to check: the reference size, and the back-links against the link chip style.
- **Long code blocks**: suspected. Check very long lines (sideways scroll, focus state), very tall blocks, and Shiki's token colours against the theme's `pre` background in both modes.
- **Table of contents**: not applicable yet. The starter has no table of contents (it's a nice-to-have in the brief); check this if one is added. A nested `ul` of links (in the `aside`, or at the top of a post) gets tick bullets that grow with nesting. Check whether that reads well as a TOC.
- **Tag lists**: suspected. For now tags on cards and posts are inline, comma-separated links in a `footer` or `p`, not a `ul`, so there's no vertical list; the `/tags/` index is a plain `ul` with post counts in `small`. Check both read well. Originally: Tags on a card or post are a short list of links. A `ul` has tick bullets and a vertical layout, so there may be no classless way to lay out an inline tag row except `nav > ul` (which is wrong semantically).

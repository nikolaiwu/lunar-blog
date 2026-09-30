# Conventions

## Tooling

- **pnpm**, pinned through `packageManager` in `package.json` (match the LunarCSS repo's pnpm major). pnpm only runs dependency install scripts that are allowlisted under `allowBuilds` in `pnpm-workspace.yaml`. Astro needs `esbuild` and `sharp` there, and anything else that fails to install for this reason gets added too.
- **Node:** whatever the current Astro major requires; CI uses Node 24. Set `engines.node` to match Astro.
- **Prettier** with `prettier-plugin-astro`. Add `format` and `format:check` scripts, and run `pnpm format` after editing.
- **Type checking:** `pnpm astro check` (it needs `@astrojs/check` and `typescript`). Use the `strict` tsconfig preset Astro provides.
- **Scripts:** `dev`, `build`, `preview`, `check`, `format`, `format:check`. Keep them standard, because template users expect them.

## Markup

- No `class` attributes, no inline `style`, no component `<style>` blocks. Astro's scoped styles are unlayered and would override the theme. If the markup can't express something, it's either a theme gap or a rule in `site.css`.
- `data-*` and ARIA attributes are fine as hooks (e.g. `aria-current`, `aria-label` on a second `nav`).
- Semantic elements first: `header`, `nav`, `main`, `article`, `aside`, `footer`, `time`, `figure`/`figcaption`. Keep the heading levels in order on every page.

## `site.css`

- Unlayered, and as short as possible. Every rule has a comment saying why it exists: a documented User Guide pattern, Shiki colours, or a known gap with a link to [theme-gaps.md](theme-gaps.md).
- Values come from `var(--lunar-*)`. The one exception is Shiki's `--shiki-light` / `--shiki-dark`.
- Structural selectors only, no classes. The same rule as the theme.

## Dependencies

Keep them few: `astro`, `@nikolaiwu/lunarcss`, `@astrojs/mdx`, `@astrojs/markdown-satteri` (Astro's own Markdown processor; installed to pass it plugins), `@astrojs/rss`, `@astrojs/sitemap`, `sharp` (Astro's image service; under pnpm, Astro can't see the copy it lists as optional, so it's a direct dependency), and the dev tooling (including `sass`, for local theme mode; see [lunarcss.md](lunarcss.md)). Every extra dependency is something template users inherit and have to maintain, so ask before adding one.

## Accessibility

- Visible focus comes from the theme, so don't remove outlines.
- Images need alt text, which the schema enforces for hero images.
- `<html lang>` comes from `site.config.ts`.
- Check contrast in both light and dark. The site follows the system setting, so switch it in the OS or emulate `prefers-color-scheme` in dev tools.
- Check each page with the keyboard, and in Windows contrast mode if possible (the theme supports forced colors).

## Git and issues

- Commit straight to `main`. No feature branches unless the user asks.
- Don't push, tag, publish, submit to directories or file issues without being asked.
- Track this repo's bugs and features as GitHub Issues on `nikolaiwu/lunar-blog` via `gh`. Theme bugs go to `nikolaiwu/lunarcss`.
- Keep a `CHANGELOG.md` in Keep a Changelog format, as LunarCSS does.
- When a change affects anything described in `docs/`, update the doc in the same commit.

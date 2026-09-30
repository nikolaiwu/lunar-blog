// robots.txt: lets every crawler in, and points it at the sitemap. It's an
// endpoint, not a file in public/, so the sitemap URL gets the site and base
// path from astro.config.mjs.
//
// Crawlers only read robots.txt at the root of a host. Deployed at a domain
// root, this is it; under a base path (like the demo's /lunar-blog/) it's
// ignored, and search engines find the sitemap through <link rel="sitemap">
// or a manual submission in their webmaster tools instead.
import type { APIContext } from "astro";
import { url } from "../lib/url";

export function GET(context: APIContext) {
  const sitemap = new URL(url("sitemap-index.xml"), context.site);
  const body = [
    '# The 404 page carries <meta name="robots" content="noindex">, which',
    "# keeps it out of search results. Nothing is disallowed here on purpose:",
    "# a crawler that can't fetch a page can't see its noindex either.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemap}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

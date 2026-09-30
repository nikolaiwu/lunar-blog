// Every internal link goes through url(), so the site works both at a domain
// root and under a base path like /lunar-blog/ (see astro.config.mjs).
// BASE_URL may or may not end in a slash depending on Astro's trailingSlash
// setting, so normalise it once here.
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

// url("posts/") → "/lunar-blog/posts/", url() → "/lunar-blog/"
export function url(path = ""): string {
  return `${base}/${path.replace(/^\//, "")}`;
}

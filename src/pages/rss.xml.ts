// The RSS feed at /rss.xml: every published post, newest first, with its
// title, description, date and tags.
//
// `site` is the blog's home page with the base path (not just the host), since
// @astrojs/rss uses it as the channel link. Item links come from url(), so
// they carry the base path too, and are made absolute against it.
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
import { url } from "../lib/url";
import { siteConfig } from "../site.config";

export async function GET(context: APIContext) {
  const home = new URL(url(), context.site);
  const self = new URL(url("rss.xml"), context.site);
  const posts = await getPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: home,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    // The feed's own address, which feed validators ask for
    customData:
      `<language>${siteConfig.lang}</language>` +
      `<atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: url(`posts/${post.id}/`),
    })),
  });
}

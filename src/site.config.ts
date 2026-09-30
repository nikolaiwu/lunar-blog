// Everything that names or describes this blog lives here, so you can make it
// yours in one place. Pages and layouts import this object; none of them
// hard-code the title, author or navigation.

export interface NavLink {
  label: string;
  // A path inside the site, without a leading slash (e.g. "posts/"). The
  // base path is added for you, so links work whether the blog is served
  // from a domain root or from a subfolder like /lunar-blog/.
  href: string;
}

export interface SiteConfig {
  title: string;
  // Used for the home page intro, the default meta description and the RSS feed.
  description: string;
  author: string;
  // The language of your posts, as a BCP 47 tag (e.g. "en", "en-GB", "bg").
  // Sets <html lang>, which screen readers and search engines rely on.
  lang: string;
  nav: NavLink[];
  // How many of the latest posts the home page shows.
  homePostCount: number;
  // How many posts each archive page (/posts/, /posts/2/ …) shows.
  postsPerPage: number;
  // The social preview image for pages that don't set their own: a path
  // inside public/, without a leading slash. 1200×630 works everywhere.
  ogImage: string;
  // What the social preview image shows, for people who can't see it.
  ogImageAlt: string;
}

export const siteConfig: SiteConfig = {
  title: "Lunar Blog",
  description:
    "A minimal Astro blog, styled with the classless LunarCSS theme.",
  author: "Nikolai Vuchkov",
  lang: "en",
  nav: [
    { label: "Posts", href: "posts/" },
    { label: "Tags", href: "tags/" },
    { label: "About", href: "about/" },
  ],
  homePostCount: 6,
  postsPerPage: 6,
  ogImage: "og-image.png",
  ogImageAlt: "Lunar Blog: a blog page styled by LunarCSS, in light and dark.",
};

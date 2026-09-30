import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Blog posts: one Markdown or MDX file each in src/content/posts/. The file
// name becomes the post's id and URL: hello-world.md → /posts/hello-world/.
// The schema checks every post's frontmatter at build time, so a missing
// title or a malformed date stops the build with a message naming the file.
const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        // Card text, meta description and RSS summary
        description: z.string(),
        pubDate: z.coerce.date(),
        // Shown as "Updated …" when present
        updatedDate: z.coerce.date().optional(),
        // Lower-case slugs, e.g. [css, dark-mode]. Each tag gets a page at
        // /tags/<tag>/, so it has to be safe in a URL.
        tags: z
          .array(
            z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
              error:
                "Tags must be lower-case words joined by hyphens, e.g. dark-mode",
            }),
          )
          .default([]),
        // Drafts show in `pnpm dev` and never in the build (see src/lib/posts.ts)
        draft: z.boolean().default(false),
        // A path relative to the post, e.g. ./cover.jpg. Astro optimizes it.
        heroImage: image().optional(),
        heroImageAlt: z.string().optional(),
      })
      .refine((post) => !post.heroImage || Boolean(post.heroImageAlt?.trim()), {
        error: "heroImageAlt is required when heroImage is set",
        path: ["heroImageAlt"],
      }),
});

export const collections = { posts };

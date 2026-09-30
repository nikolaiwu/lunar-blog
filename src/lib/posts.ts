import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

// Published posts, newest first. Every page gets its posts from here, so
// drafts are handled the same way everywhere: shown in `pnpm dev`, so you can
// preview them, and left out of every build.
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection(
    "posts",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  posts.forEach(checkId);
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

// Every tag used by a published post, alphabetically, with its posts
// (newest first). The tag pages are built from this.
export async function getTags(): Promise<{ tag: string; posts: Post[] }[]> {
  const byTag = new Map<string, Post[]>();
  for (const post of await getPosts()) {
    for (const tag of post.data.tags) {
      byTag.set(tag, [...(byTag.get(tag) ?? []), post]);
    }
  }
  return [...byTag]
    .map(([tag, posts]) => ({ tag, posts }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

// A post whose id is only digits (2.md) would get the URL /posts/2/, which is
// also the second page of the post archive. Stop the build instead of letting
// one silently replace the other.
function checkId(post: Post): void {
  if (/^\d+$/.test(post.id)) {
    throw new Error(
      `The post ${post.filePath ?? post.id} has the id "${post.id}", which is only digits. ` +
        `Its URL, /posts/${post.id}/, is also a page of the post archive. ` +
        `Rename the file so its name includes a word, e.g. ${post.id}-my-post.md.`,
    );
  }
}

/**
 * /rss.xml — a real publication feed for the dispatches (very blog-real).
 */
import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts"))
    .sort((a, b) => {
      const at = a.data.publishDate ? new Date(a.data.publishDate).getTime() : 0
      const bt = b.data.publishDate ? new Date(b.data.publishDate).getTime() : 0
      return bt - at
    })

  return rss({
    title: "Wanderlust Chronicles",
    description:
      "Uncharted trails, mindful travel and secret corners of the earth — field dispatches from the Wanderlust Chronicles.",
    site: context.site ?? "https://wanderlust-chronicles.pages.dev",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.publishDate ? new Date(post.data.publishDate) : undefined,
      link: `/journal/${post.id}/`,
      categories: post.data.tags ?? [],
    })),
    customData: "<language>en-us</language>",
  })
}

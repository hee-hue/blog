import type { MetadataRoute } from "next";
import { getAllTags, getPublishedPosts } from "@/lib/posts";
import { tagHref } from "@/lib/post-utils";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts();
  const latest = posts[0]?.date;

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.5 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/posts/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllTags().map((t) => ({
      url: `${SITE_URL}${tagHref(t)}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];
}

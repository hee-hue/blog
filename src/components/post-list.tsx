"use client";

import { useState } from "react";
import Link from "next/link";
import { TagBadge } from "@/components/tag-badge";
import { formatDate, type PostMeta } from "@/lib/post-utils";
import { cn } from "@/lib/utils";

export function PostList({ posts, tags }: { posts: PostMeta[]; tags: string[] }) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="태그 필터">
        {[null, ...tags].map((tag) => {
          const selected = active === tag;
          return (
            <button
              key={tag ?? "all"}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(tag)}
              className={cn(
                "rounded-md px-2.5 py-1 text-sm transition-colors",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-tag text-tag-foreground hover:bg-accent hover:outline hover:outline-border",
              )}
            >
              {tag ?? "전체"}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 divide-y border-y">
        {visible.map((post) => (
          <li key={post.slug} className="py-7">
            <article>
              <time
                dateTime={post.date}
                className="text-sm text-muted-foreground"
              >
                {formatDate(post.date)}
              </time>
              <h2 className="mt-1 text-xl font-semibold leading-snug tracking-tight">
                <Link
                  href={`/posts/${post.slug}`}
                  className="transition-colors hover:text-link"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-muted-foreground">{post.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <TagBadge key={t}>{t}</TagBadge>
                ))}
              </div>
            </article>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-10 text-center text-muted-foreground">
            해당 태그의 글이 없습니다.
          </li>
        )}
      </ul>
    </div>
  );
}

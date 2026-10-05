import Link from "next/link";
import { TagLink } from "@/components/tag-badge";
import { formatDate, tagHref, type PostMeta } from "@/lib/post-utils";
import { cn } from "@/lib/utils";

/** 태그 칩 줄: 전체(/)와 각 태그(/tags/[tag])로 이동하는 링크 */
export function TagChips({
  tags,
  activeTag = null,
}: {
  tags: string[];
  activeTag?: string | null;
}) {
  const items = [{ label: "전체", href: "/", tag: null as string | null }].concat(
    tags.map((t) => ({ label: t, href: tagHref(t), tag: t })),
  );

  return (
    <nav aria-label="태그" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = activeTag === item.tag;
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-tag text-tag-foreground hover:bg-accent hover:outline hover:outline-border",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-y border-y">
      {posts.map((post) => (
        <li key={post.slug} className="py-7">
          <article>
            <time dateTime={post.date} className="text-sm text-muted-foreground">
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
                <TagLink key={t} tag={t} />
              ))}
            </div>
          </article>
        </li>
      ))}
      {posts.length === 0 && (
        <li className="py-10 text-center text-muted-foreground">
          아직 글이 없습니다.
        </li>
      )}
    </ul>
  );
}

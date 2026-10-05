import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList, TagChips } from "@/components/post-list";
import { getAllTags, getPostsByTag, toMeta } from "@/lib/posts";

function decodeTag(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tags/[tag]">): Promise<Metadata> {
  const tag = decodeTag((await params).tag);
  return { title: `#${tag}`, description: `${tag} 태그의 글 목록` };
}

export default async function TagPage({ params }: PageProps<"/tags/[tag]">) {
  const tag = decodeTag((await params).tag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <>
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-link">
            Posts
          </Link>{" "}
          / 태그
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          <span className="text-link">#</span>
          {tag}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">글 {posts.length}개</p>
      </header>
      <TagChips tags={getAllTags()} activeTag={tag} />
      <div className="mt-8">
        <PostList posts={posts.map(toMeta)} />
      </div>
    </>
  );
}

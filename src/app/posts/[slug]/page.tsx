import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";
import { PostActions } from "@/components/post-actions";
import { TagLink } from "@/components/tag-badge";
import { Toc } from "@/components/toc";
import { Separator } from "@/components/ui/separator";
import { MOCK_STATS } from "@/lib/mock-posts";
import { formatDate } from "@/lib/post-utils";
import {
  getAdjacentPosts,
  getPost,
  getPublishedPosts,
} from "@/lib/posts";

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.summary } : {};
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <div className="relative">
      <Toc items={post.headings} />

      <article>
        <header>
          <h1 className="text-3xl font-bold leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>읽는 시간 {post.readingMinutes}분</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <TagLink key={t} tag={t} />
            ))}
          </div>
          <div className="mt-6">
            <PostActions initialLikes={MOCK_STATS[post.slug]?.likes ?? 0} />
          </div>
        </header>

        <Separator className="my-8" />

        <div className="text-[1.0625rem]">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

      <Separator className="my-10" />

      <section aria-label="댓글" className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        댓글(giscus)은 이후 단계에서 연결됩니다.
      </section>

      <nav aria-label="이전/다음 글" className="mt-10 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/posts/${prev.slug}`}
            className="rounded-md border bg-card p-4 transition-colors hover:bg-accent"
          >
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <ArrowLeft className="size-4" aria-hidden /> 이전 글
            </span>
            <span className="mt-1 block font-medium leading-snug">{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next && (
          <Link
            href={`/posts/${next.slug}`}
            className="rounded-md border bg-card p-4 text-right transition-colors hover:bg-accent sm:col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
              다음 글 <ArrowRight className="size-4" aria-hidden />
            </span>
            <span className="mt-1 block font-medium leading-snug">{next.title}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}

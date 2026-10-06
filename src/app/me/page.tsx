import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookmarkRemoveButton } from "@/components/bookmark-remove-button";
import { TagLink } from "@/components/tag-badge";
import { formatDate } from "@/lib/post-utils";
import { getPublishedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

// 요청마다 로그인한 사용자의 북마크를 읽어야 하므로 정적 생성하지 않는다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "내 북마크",
  robots: { index: false, follow: false },
};

export default async function MePage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold tracking-tight">인증이 설정되지 않았습니다</h1>
        <p className="mt-3 text-muted-foreground">Supabase 연결 후 사용할 수 있습니다.</p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/me");

  // RLS 로 본인의 북마크만 읽을 수 있다.
  const { data: rows, error } = await supabase
    .from("bookmarks")
    .select("post_slug, created_at")
    .order("created_at", { ascending: false });

  const posts = getPublishedPosts();
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  // 삭제되었거나 비공개로 바뀐 글은 목록에서 뺀다.
  const items = (rows ?? []).flatMap((r) => {
    const post = bySlug.get(r.post_slug);
    return post ? [post] : [];
  });

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">내 북마크</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        북마크한 글은 나만 볼 수 있습니다.
      </p>

      {error ? (
        <p role="alert" className="mt-10 text-center text-destructive">
          북마크를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      ) : items.length === 0 ? (
        <div className="mt-10 border-y py-12 text-center">
          <p className="font-medium">아직 북마크한 글이 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">
            글 상세에서 북마크 버튼을 눌러 저장해 보세요.
          </p>
          <Link href="/" className="mt-4 inline-block text-link underline underline-offset-4">
            글 목록 보기
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y border-y">
          {items.map((post) => (
            <li key={post.slug} className="flex items-start justify-between gap-4 py-6">
              <article className="min-w-0">
                <time dateTime={post.date} className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </time>
                <h2 className="mt-1 text-lg font-semibold leading-snug tracking-tight">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="transition-colors hover:text-link"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <TagLink key={t} tag={t} />
                  ))}
                </div>
              </article>
              <BookmarkRemoveButton slug={post.slug} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

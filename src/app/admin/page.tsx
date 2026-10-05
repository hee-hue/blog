import type { Metadata } from "next";
import { AdminTable, type StatRow } from "@/components/admin-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STATS } from "@/lib/mock-posts";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "관리자", robots: { index: false, follow: false } };

export default function AdminPage() {
  const rows: StatRow[] = getPublishedPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    likes: MOCK_STATS[p.slug]?.likes ?? 0,
    bookmarks: MOCK_STATS[p.slug]?.bookmarks ?? 0,
  }));

  const topLikes = [...rows].sort((a, b) => b.likes - a.likes)[0];
  const topBookmarks = [...rows].sort((a, b) => b.bookmarks - a.bookmarks)[0];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">관리자</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        목업 화면입니다. 접근 제어와 실제 집계는 인증·DB 연동 단계에서 적용됩니다.
        개인정보 없이 집계 수치만 표시합니다.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SummaryCard label="좋아요 1위" title={topLikes.title} value={`${topLikes.likes}개`} />
        <SummaryCard
          label="북마크 1위"
          title={topBookmarks.title}
          value={`${topBookmarks.bookmarks}개`}
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">글별 현황</h2>
        <AdminTable rows={rows} />
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  title,
  value,
}: {
  label: string;
  title: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-link">{value}</p>
        <p className="mt-1 text-sm leading-snug">{title}</p>
      </CardContent>
    </Card>
  );
}

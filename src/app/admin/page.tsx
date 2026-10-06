import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminTable, type StatRow } from "@/components/admin-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_STATS } from "@/lib/mock-posts";
import { getPublishedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

// 요청마다 세션을 확인해야 하므로 정적 생성하지 않는다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "관리자", robots: { index: false, follow: false } };

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-10 text-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">{children}</p>
    </div>
  );
}

// 관리자만 볼 수 있다. 설정이 없거나 권한을 확인하지 못하면 접근을 막는다(fail closed).
export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) {
    return <Notice title="인증이 설정되지 않았습니다">Supabase 연결 후 사용할 수 있습니다.</Notice>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  // RLS 로 본인의 profiles 행만 읽을 수 있다.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return <Notice title="접근 권한이 없습니다">관리자 계정으로 로그인해 주세요.</Notice>;
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
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

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminTable, type StatRow } from "@/components/admin-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/posts";
import { createClient } from "@/lib/supabase/server";

// 요청마다 세션을 확인해야 하므로 정적 생성하지 않는다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false },
};

type StatsRow = { slug: string; like_count: number; bookmark_count: number };

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

  // 집계 함수는 DB 에서 관리자인지 한 번 더 검사하며, 개수만 돌려준다.
  const { data, error } = await supabase.rpc("admin_post_stats");
  if (error) {
    return (
      <Notice title="집계를 불러오지 못했습니다">
        잠시 후 다시 시도해 주세요. 계속되면 SQL(0003)이 적용되었는지 확인해 주세요.
      </Notice>
    );
  }

  const stats = new Map((data as StatsRow[]).map((r) => [r.slug, r]));
  // 공개된 글만 표시한다. 반응이 없는 글은 0 으로 보인다.
  const rows: StatRow[] = getPublishedPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    likes: Number(stats.get(p.slug)?.like_count ?? 0),
    bookmarks: Number(stats.get(p.slug)?.bookmark_count ?? 0),
  }));

  return <AdminDashboard rows={rows} />;
}

function top(rows: StatRow[], key: "likes" | "bookmarks") {
  const best = [...rows].sort((a, b) => b[key] - a[key])[0];
  return best && best[key] > 0 ? best : null;
}

function AdminDashboard({ rows }: { rows: StatRow[] }) {
  const topLikes = top(rows, "likes");
  const topBookmarks = top(rows, "bookmarks");

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">관리자</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        읽기 전용 화면입니다. 이메일 등 개인정보는 표시하지 않고 집계 수치만 보여줍니다.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <SummaryCard
          label="좋아요 1위"
          title={topLikes?.title}
          value={topLikes ? `${topLikes.likes}개` : undefined}
        />
        <SummaryCard
          label="북마크 1위"
          title={topBookmarks?.title}
          value={topBookmarks ? `${topBookmarks.bookmarks}개` : undefined}
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
  title?: string;
  value?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {value && title ? (
          <>
            <p className="text-2xl font-bold text-link">{value}</p>
            <p className="mt-1 text-sm leading-snug">{title}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">아직 집계된 반응이 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Kind = "likes" | "bookmarks";

// 글 페이지는 정적 생성을 유지하므로 좋아요 수와 내 상태는 클라이언트에서 불러온다.
export function PostActions({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [count, setCount] = useState<number | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef<Set<Kind>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let cancelled = false;

    supabase.rpc("get_like_count", { p_slug: slug }).then(({ data }) => {
      if (!cancelled && typeof data === "number") setCount(data);
      else if (!cancelled && typeof data === "string") setCount(Number(data));
    });

    async function loadMine(userId: string | null) {
      if (!supabase) return;
      if (!userId) {
        if (!cancelled) {
          setLoggedIn(false);
          setLiked(false);
          setBookmarked(false);
        }
        return;
      }
      const [l, b] = await Promise.all([
        supabase.from("likes").select("post_slug").eq("post_slug", slug).maybeSingle(),
        supabase.from("bookmarks").select("post_slug").eq("post_slug", slug).maybeSingle(),
      ]);
      if (cancelled) return;
      setLoggedIn(true);
      setLiked(Boolean(l.data));
      setBookmarked(Boolean(b.data));
    }

    supabase.auth.getUser().then(({ data }) => loadMine(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      loadMine(session?.user?.id ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [slug]);

  async function toggle(kind: Kind) {
    const supabase = createClient();
    // 비로그인(또는 설정 없음)이면 로그인 후 이 글로 돌아오게 한다.
    if (!supabase || !loggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (pending.current.has(kind)) return;
    pending.current.add(kind);
    setError("");

    const on = kind === "likes" ? liked : bookmarked;
    const apply = (v: boolean) => {
      if (kind === "likes") {
        setLiked(v);
        setCount((c) => (c === null ? c : Math.max(0, c + (v ? 1 : -1))));
      } else setBookmarked(v);
    };

    apply(!on); // 먼저 화면을 바꾸고 실패하면 되돌린다.
    const { error: err } = on
      ? await supabase.from(kind).delete().eq("post_slug", slug)
      : await supabase.from(kind).insert({ post_slug: slug });

    // 이미 눌린 상태(중복 키)는 성공으로 본다.
    if (err && err.code !== "23505") {
      apply(on);
      setError("저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
    pending.current.delete(kind);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={liked}
          onClick={() => toggle("likes")}
        >
          <Heart className={liked ? "fill-current text-link" : ""} />
          좋아요{count !== null ? ` ${count}` : ""}
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={bookmarked}
          onClick={() => toggle("bookmarks")}
        >
          <Bookmark className={bookmarked ? "fill-current text-link" : ""} />
          {bookmarked ? "북마크됨" : "북마크"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

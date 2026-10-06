"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { hasSessionCookie, loadSupabase } from "@/lib/supabase/lazy";

// 글 페이지는 정적 생성을 유지해야 하므로, 로그인 상태는 클라이언트에서 불러온다.
export function AuthButton() {
  const router = useRouter();
  const pathname = usePathname();
  // undefined: 확인 중, null: 비로그인
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function init() {
      // 세션 쿠키가 없으면 비로그인이므로 Supabase 를 불러오지 않는다.
      if (!hasSessionCookie()) {
        if (!cancelled) setEmail(null);
        return;
      }
      const supabase = await loadSupabase();
      if (!supabase || cancelled) {
        if (!cancelled) setEmail(null);
        return;
      }
      const { data } = await supabase.auth.getUser();
      if (!cancelled) setEmail(data.user?.email ?? null);
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setEmail(session?.user?.email ?? null);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    }

    init();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  async function signOut() {
    const supabase = await loadSupabase();
    await supabase?.auth.signOut();
    setEmail(null);
    router.refresh();
  }

  // 확인 중에는 같은 크기의 빈 자리를 두어 레이아웃이 흔들리지 않게 한다.
  if (email === undefined) return <span className="inline-block h-7 w-16" aria-hidden />;

  if (email === null) {
    const next = pathname && pathname !== "/login" ? `?next=${encodeURIComponent(pathname)}` : "";
    return (
      <Link
        href={`/login${next}`}
        className={buttonVariants({ variant: "default", size: "sm" })}
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-32 truncate text-sm text-muted-foreground sm:inline" title={email}>
        {email}
      </span>
      <Link
        href="/me"
        className="rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        북마크
      </Link>
      <Button variant="outline" size="sm" onClick={signOut}>
        로그아웃
      </Button>
    </div>
  );
}

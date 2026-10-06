"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

// 글 페이지는 정적 생성을 유지해야 하므로, 로그인 상태는 클라이언트에서 불러온다.
export function AuthButton() {
  const router = useRouter();
  const pathname = usePathname();
  // undefined: 확인 중, null: 비로그인
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      // 설정이 없으면 비로그인으로 취급한다.
      const t = setTimeout(() => setEmail(null), 0);
      return () => clearTimeout(t);
    }
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await createClient()?.auth.signOut();
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
      <Button variant="outline" size="sm" onClick={signOut}>
        로그아웃
      </Button>
    </div>
  );
}

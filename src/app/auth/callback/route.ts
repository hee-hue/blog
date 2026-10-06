import { NextResponse } from "next/server";
import { safeNext } from "@/lib/auth-utils";
import { createClient } from "@/lib/supabase/server";

// 이메일 링크를 눌렀을 때 돌아오는 주소. code 를 세션으로 교환하고 원래 화면으로 보낸다.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth", url.origin));
}

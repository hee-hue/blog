import { NextResponse } from "next/server";
import { safeNext } from "@/lib/auth-utils";
import { createClient } from "@/lib/supabase/server";

// 이메일 링크를 눌렀을 때 돌아오는 주소. code 를 세션으로 교환하고 원래 화면으로 보낸다.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const fail = (reason: "expired" | "auth") =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, url.origin));

  // 링크가 만료되었거나 이미 사용된 경우 Supabase 가 error_code 를 붙여 돌려보낸다.
  const errorCode = url.searchParams.get("error_code");
  if (errorCode) {
    console.error("[auth/callback] link error:", errorCode);
    return fail(errorCode === "otp_expired" ? "expired" : "auth");
  }

  if (!code) {
    console.error("[auth/callback] missing code");
    return fail("auth");
  }

  const supabase = await createClient();
  if (!supabase) return fail("auth");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // code 값은 로그에 남기지 않는다.
    console.error("[auth/callback] exchange failed:", error.code ?? error.status, error.message);
    return fail("auth");
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

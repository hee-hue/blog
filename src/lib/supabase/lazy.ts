import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/**
 * Supabase 클라이언트(약 70KB gzip)는 초기 번들에 넣지 않고 필요할 때만 불러온다.
 * 대부분의 방문자는 로그인하지 않았으므로 글을 읽는 것만으로는 내려받지 않는다.
 */
export async function loadSupabase() {
  if (!isSupabaseConfigured) return null;
  const { createClient } = await import("./client");
  return createClient();
}

/** 로그인 세션 쿠키가 있는지 확인한다(값은 읽지 않고 존재만 본다). 클라이언트에서만 호출한다. */
export function hasSessionCookie(): boolean {
  return /(?:^|;\s*)sb-[^=]*-auth-token/.test(document.cookie);
}

/** 비로그인 방문자도 볼 수 있는 글별 좋아요 수. supabase-js 없이 REST 로 직접 조회한다. */
export async function fetchLikeCount(slug: string): Promise<number | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_like_count`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_slug: slug }),
    });
    if (!res.ok) return null;
    const n = Number(await res.json());
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

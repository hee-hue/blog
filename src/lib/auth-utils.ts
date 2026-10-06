/**
 * 로그인 후 돌아갈 경로를 검증한다. 같은 사이트의 경로(/로 시작, //나 \ 불가)만 허용해서
 * 외부 주소로의 리다이렉트(open redirect)를 막는다.
 */
export function safeNext(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}

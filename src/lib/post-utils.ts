// 서버/클라이언트 어디서나 import 가능한 순수 유틸 (fs 사용 금지)

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
};

export function formatDate(date: string): string {
  return date.replaceAll("-", ". ");
}

/** 제목 텍스트 → 앵커 id (한글 유지). MDX 렌더링과 목차가 같은 함수를 쓴다. */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

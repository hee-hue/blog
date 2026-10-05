import type { SearchEntry } from "@/lib/post-utils";

const WEIGHT = { title: 10, tag: 6, summary: 3, body: 1 } as const;

function norm(text: string): string {
  // IME/OS 에 따라 NFD 로 들어오는 한글을 NFC 로 맞춘다.
  return text.normalize("NFC").toLowerCase();
}

function scoreToken(entry: SearchEntry, token: string): number {
  let score = 0;
  if (norm(entry.title).includes(token)) score += WEIGHT.title;
  if (entry.tags.some((t) => norm(t).includes(token))) score += WEIGHT.tag;
  if (norm(entry.summary).includes(token)) score += WEIGHT.summary;
  if (norm(entry.body).includes(token)) score += WEIGHT.body;
  return score;
}

/**
 * 공백으로 나눈 모든 검색어가 어딘가에 포함된 글만 반환한다(AND).
 * 한국어는 형태소 분석 없이 부분 문자열 매칭으로 처리한다.
 * 정렬: 점수 높은 순, 같으면 최신 글 먼저.
 */
export function searchPosts(entries: SearchEntry[], query: string): SearchEntry[] {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    let total = 0;
    let matchedAll = true;
    for (const token of tokens) {
      const s = scoreToken(entry, token);
      if (s === 0) {
        matchedAll = false;
        break;
      }
      total += s;
    }
    if (matchedAll) scored.push({ entry, score: total });
  }

  return scored
    .sort((a, b) => b.score - a.score || (a.entry.date < b.entry.date ? 1 : -1))
    .map((r) => r.entry);
}

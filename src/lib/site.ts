export const SITE = {
  name: "Dev Notes",
  description: "회고, 커리어, AI와 바이브코딩을 기록하는 개인 기술 블로그",
  author: "작성자",
  language: "ko-KR",
} as const;

export const THEME_STORAGE_KEY = "theme";

/**
 * 절대 URL 의 기준 주소 (끝의 / 제거).
 * 우선순위: NEXT_PUBLIC_SITE_URL > Vercel 이 알려주는 프로덕션 도메인 > 로컬.
 * 커스텀 도메인을 연결하면 NEXT_PUBLIC_SITE_URL 에 그 주소를 지정한다.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

/** giscus 설정 (https://giscus.app/ko). 값이 비어 있으면 댓글 영역은 안내만 표시한다. */
export const GISCUS = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
} as const;

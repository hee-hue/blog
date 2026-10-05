export const SITE = {
  name: "Dev Notes",
  description: "회고, 커리어, AI와 바이브코딩을 기록하는 개인 기술 블로그",
  author: "작성자",
  language: "ko-KR",
} as const;

export const THEME_STORAGE_KEY = "theme";

/** 절대 URL 의 기준 주소 (끝의 / 제거). 배포 시 NEXT_PUBLIC_SITE_URL 로 지정한다. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

/** giscus 설정 (https://giscus.app/ko). 값이 비어 있으면 댓글 영역은 안내만 표시한다. */
export const GISCUS = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO ?? "",
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? "",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "",
} as const;

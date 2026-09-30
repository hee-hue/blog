// 목업 데이터: 이후 마일스톤에서 /content/posts/*.mdx 로 대체된다.

export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; code: string };

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  tags: string[];
  draft: boolean;
  blocks: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "vibe-coding-first-week",
    title: "바이브코딩으로 블로그를 만든 첫 주 회고",
    date: "2026-09-28",
    summary:
      "PRD를 먼저 쓰고 AI와 함께 작게 나눠 만들어 보니, 속도보다 방향을 잡는 일이 더 중요했다.",
    tags: ["회고", "바이브코딩", "AI"],
    draft: false,
    blocks: [
      {
        type: "p",
        text: "이번 주에 처음으로 AI 코딩 도구와 함께 개인 블로그를 처음부터 끝까지 만들어 봤다. 결과물보다 과정에서 배운 것이 많아서 기록해 둔다.",
      },
      { type: "h2", id: "prd-first", text: "PRD부터 쓴 이유" },
      {
        type: "p",
        text: "코드를 한 줄도 쓰기 전에 무엇을 만들고 무엇을 만들지 않을지를 문서로 먼저 정리했다. 제외 범위를 적어 두니 AI가 제안하는 기능을 거절하기가 훨씬 쉬웠다.",
      },
      {
        type: "ul",
        items: [
          "목표와 제외 범위를 함께 적는다",
          "디자인 원칙(색, 폰트, 폭)을 미리 못 박는다",
          "마일스톤을 작게 쪼갠다",
        ],
      },
      { type: "h2", id: "small-steps", text: "작게 나눠서 만들기" },
      {
        type: "p",
        text: "한 번에 큰 기능을 요청하면 결과를 검토하기 어렵다. 화면 하나, 컴포넌트 하나 단위로 요청하고 매번 빌드가 통과하는지 확인하는 방식이 가장 안정적이었다.",
      },
      {
        type: "code",
        lang: "bash",
        code: "npm run build\nnpm run lint",
      },
      { type: "h2", id: "takeaways", text: "이번 주에 남은 것" },
      {
        type: "p",
        text: "AI는 빠르게 만들어 주지만 무엇이 좋은 결과인지는 내가 정해야 한다. 다음 주에는 글 작성 흐름(MDX)을 붙여 볼 계획이다.",
      },
    ],
  },
  {
    slug: "junior-to-mid-career",
    title: "주니어에서 미들로, 커리어 전환기에 배운 것들",
    date: "2026-09-20",
    summary:
      "시키는 일을 잘하는 것에서 문제를 정의하는 일로 넘어가며 달라진 습관들을 정리했다.",
    tags: ["커리어", "회고"],
    draft: false,
    blocks: [
      {
        type: "p",
        text: "연차가 쌓이면서 평가 기준이 조용히 바뀌었다. 티켓을 빠르게 처리하는 것보다 어떤 티켓을 만들어야 하는지를 고민하는 시간이 늘었다.",
      },
      { type: "h2", id: "define-problem", text: "문제를 먼저 정의하기" },
      {
        type: "p",
        text: "구현에 들어가기 전에 이 일이 해결하려는 문제와 성공 기준을 한 문단으로 적는다. 이 습관 하나로 재작업이 눈에 띄게 줄었다.",
      },
      { type: "h2", id: "communication", text: "커뮤니케이션 비용 줄이기" },
      {
        type: "ul",
        items: [
          "질문할 때는 시도해 본 것과 막힌 지점을 함께 적는다",
          "진행 상황은 묻기 전에 먼저 공유한다",
          "결정 사항은 문서로 남긴다",
        ],
      },
      { type: "h2", id: "next", text: "앞으로의 계획" },
      {
        type: "p",
        text: "당분간은 기록하는 습관을 유지하면서, 작은 범위라도 설계부터 맡아 보려고 한다.",
      },
    ],
  },
  {
    slug: "prompt-habits-for-ai-coding",
    title: "AI 코딩 도구와 잘 일하는 프롬프트 습관",
    date: "2026-09-12",
    summary:
      "맥락을 파일로 남기고, 계획을 먼저 확인받고, 결과를 검증하는 세 가지 습관을 소개한다.",
    tags: ["AI", "바이브코딩"],
    draft: false,
    blocks: [
      {
        type: "p",
        text: "AI 코딩 도구를 쓰다 보면 같은 설명을 반복하게 된다. 반복을 줄이고 결과의 일관성을 높이기 위해 몇 가지 습관을 만들었다.",
      },
      { type: "h2", id: "context-files", text: "맥락은 파일로 남기기" },
      {
        type: "p",
        text: "프로젝트 규칙은 대화가 아니라 저장소의 문서에 적어 둔다. 새 대화를 시작해도 같은 기준으로 작업이 이어진다.",
      },
      {
        type: "code",
        lang: "md",
        code: "## 디자인 원칙\n- 폰트: Pretendard 하나로 통일\n- 색상은 CSS 변수로만 정의\n- 본문 폭은 max-w-2xl",
      },
      { type: "h2", id: "plan-first", text: "계획을 먼저 확인하기" },
      {
        type: "p",
        text: "큰 변경은 바로 시키지 않고 계획을 먼저 보여 달라고 요청한다. 방향이 틀렸다면 코드가 만들어지기 전에 바로잡을 수 있다.",
      },
      { type: "h2", id: "verify", text: "결과는 반드시 검증하기" },
      {
        type: "p",
        text: "빌드, 린트, 화면 확인까지 끝나야 한 단계가 끝난 것으로 본다. 아래처럼 간단한 검증 함수를 두는 것도 도움이 된다.",
      },
      {
        type: "code",
        lang: "ts",
        code: 'function assertNever(value: never): never {\n  throw new Error(`처리되지 않은 값: ${String(value)}`);\n}',
      },
    ],
  },
];

export function getPublishedPosts(): Post[] {
  return POSTS.filter((p) => !p.draft).sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function getPost(slug: string): Post | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}

/** 이전 글 = 더 오래된 글, 다음 글 = 더 최신 글 */
export function getAdjacentPosts(slug: string) {
  const list = getPublishedPosts();
  const i = list.findIndex((p) => p.slug === slug);
  return {
    prev: i >= 0 ? (list[i + 1] ?? null) : null,
    next: i > 0 ? list[i - 1] : null,
  };
}

export function getAllTags(): string[] {
  return [...new Set(getPublishedPosts().flatMap((p) => p.tags))];
}

/** 본문 글자 수 기준(분당 약 500자)으로 읽는 시간 계산 */
export function getReadingMinutes(post: Post): number {
  const chars = post.blocks.reduce((sum, b) => {
    if (b.type === "ul") return sum + b.items.join("").length;
    if (b.type === "code") return sum + b.code.length;
    return sum + b.text.length;
  }, 0);
  return Math.max(1, Math.round(chars / 500));
}

export function formatDate(date: string): string {
  return date.replaceAll("-", ". ");
}

// 목업: 관리자 화면용 집계 수치 (실제 연동 시 Supabase 집계로 대체)
export const MOCK_STATS: Record<string, { likes: number; bookmarks: number }> = {
  "vibe-coding-first-week": { likes: 24, bookmarks: 11 },
  "junior-to-mid-career": { likes: 17, bookmarks: 19 },
  "prompt-habits-for-ai-coding": { likes: 31, bookmarks: 14 },
};

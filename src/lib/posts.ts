import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugifyHeading, type PostMeta, type SearchEntry } from "@/lib/post-utils";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type Heading = { id: string; text: string };

export type Post = PostMeta & {
  draft: boolean;
  content: string;
  readingMinutes: number;
  headings: Heading[];
};

function extractHeadings(content: string): Heading[] {
  // 코드 블록 안의 '##' 은 제목이 아니므로 먼저 제거한다.
  const withoutCode = content.replace(/^(```|~~~)[\s\S]*?^\1/gm, "");
  return [...withoutCode.matchAll(/^##\s+(.+)$/gm)].map((m) => ({
    id: slugifyHeading(m[1]),
    text: m[1].trim(),
  }));
}

/** 본문 글자 수 기준(분당 약 500자). 코드 블록은 훑어 읽으므로 30%만 반영한다. */
function calcReadingMinutes(content: string): number {
  const codeChars = [...content.matchAll(/^(```|~~~)[\s\S]*?^\1/gm)].reduce(
    (sum, m) => sum + m[0].length,
    0,
  );
  const weighted = content.length - codeChars + codeChars * 0.3;
  return Math.max(1, Math.round(weighted / 500));
}

function readPost(file: string): Post {
  const slug = file.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  for (const key of ["title", "date", "summary"] as const) {
    if (typeof data[key] !== "string" || !data[key]) {
      throw new Error(`[content/posts/${file}] frontmatter '${key}' 가 필요합니다.`);
    }
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    summary: data.summary,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    content,
    readingMinutes: calcReadingMinutes(content),
    headings: extractHeadings(content),
  };
}

/** 공개 글만 최신순으로 반환 (draft 제외) */
export function getPublishedPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPost)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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

/** 목록 등 클라이언트로 넘기는 용도: 본문을 제외한 메타 정보 */
export function toMeta({ slug, title, date, summary, tags }: Post): PostMeta {
  return { slug, title, date, summary, tags };
}

export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((p) => p.tags.includes(tag));
}

const SEARCH_BODY_LIMIT = 2000;

/** 검색용 본문: 코드 블록과 마크다운 기호를 제거하고 길이를 제한한다. */
function toSearchBody(content: string): string {
  return content
    .replace(/^(```|~~~)[\s\S]*?^\1/gm, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^[#>\-*+\d.\s]+/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SEARCH_BODY_LIMIT);
}

export function buildSearchIndex(): SearchEntry[] {
  return getPublishedPosts().map((p) => ({
    ...toMeta(p),
    body: toSearchBody(p.content),
  }));
}

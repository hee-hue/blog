import { buildSearchIndex } from "@/lib/posts";

// 빌드 시점에 정적 파일로 생성된다.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}

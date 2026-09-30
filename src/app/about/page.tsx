import type { Metadata } from "next";
import { TagBadge } from "@/components/tag-badge";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

const STACK = ["TypeScript", "React", "Next.js", "Tailwind CSS", "Supabase"];
const LINKS = [
  { label: "GitHub", href: "https://github.com/" },
  { label: "이메일", href: "mailto:hello@example.com" },
];

export default function AboutPage() {
  return (
    <article>
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="mt-6 text-[1.0625rem]">
        안녕하세요, {SITE.author}입니다. 회고와 커리어, AI 코딩 도구로 무언가를
        만들어 본 경험을 기록합니다. (소개 문구는 이후 확정 예정인 샘플입니다.)
      </p>

      <Separator className="my-10" />

      <section>
        <h2 className="text-xl font-semibold tracking-tight">기술 스택</h2>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {STACK.map((s) => (
            <TagBadge key={s}>{s}</TagBadge>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">연락처 / 링크</h2>
        <ul className="mt-4 space-y-2">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-link underline-offset-4 hover:underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

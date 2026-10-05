"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/posts";
import { cn } from "@/lib/utils";

export function Toc({ items }: { items: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  // 상단 기준선(헤더 아래)을 지난 마지막 제목을 현재 섹션으로 본다.
  // 페이지 끝까지 스크롤하면 마지막 제목을 활성으로 둔다(짧은 글 대응).
  useEffect(() => {
    const els = items
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current: string | null = null;
      if (atBottom) current = els[els.length - 1].id;
      else {
        for (const el of els) {
          if (el.getBoundingClientRect().top <= 120) current = el.id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="absolute left-full top-0 ml-12 hidden h-full w-48 xl:block">
      <nav aria-label="목차" className="sticky top-24 text-sm">
        <p className="mb-3 font-semibold">목차</p>
        <ul className="space-y-2 border-l">
          {items.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={active === h.id ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l pl-3 transition-colors hover:border-point hover:text-link",
                  active === h.id
                    ? "border-point font-medium text-link"
                    : "border-transparent text-muted-foreground",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

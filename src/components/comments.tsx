"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { GISCUS } from "@/lib/site";

// giscus 는 댓글 영역이 화면 근처에 왔을 때만 불러온다(초기 로딩/하이드레이션 비용 절감).
const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

// <html class="dark"> 변화를 구독해서 giscus 테마를 사이트 테마와 맞춘다.
function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function useIsDark() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );
}

export function Comments() {
  const dark = useIsDark();
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const configured = GISCUS.repo && GISCUS.repoId && GISCUS.categoryId;

  useEffect(() => {
    const el = ref.current;
    if (!el || !configured) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [configured]);

  if (!configured) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        댓글(giscus) 설정이 아직 없습니다.
      </p>
    );
  }

  return (
    <div ref={ref} className="min-h-40">
      {near && (
        <Giscus
          repo={GISCUS.repo as `${string}/${string}`}
          repoId={GISCUS.repoId}
          category={GISCUS.category}
          categoryId={GISCUS.categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={dark ? "dark" : "light"}
          lang="ko"
          loading="lazy"
        />
      )}
    </div>
  );
}

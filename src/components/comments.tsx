"use client";

import { useSyncExternalStore } from "react";
import Giscus from "@giscus/react";
import { GISCUS } from "@/lib/site";

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
  const configured = GISCUS.repo && GISCUS.repoId && GISCUS.categoryId;

  if (!configured) {
    return (
      <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        댓글(giscus) 설정이 아직 없습니다.
      </p>
    );
  }

  return (
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
  );
}

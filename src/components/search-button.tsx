"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, type SearchEntry } from "@/lib/post-utils";
import { searchPosts } from "@/lib/search";
import { cn } from "@/lib/utils";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function SearchButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const loading = useRef(false);

  // 단축키: '/' (입력 중이 아닐 때), Ctrl/Cmd + K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (
        e.key === "/" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 처음 열릴 때 한 번만 인덱스를 불러온다.
  useEffect(() => {
    if (!open || entries || loading.current) return;
    loading.current = true;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: SearchEntry[]) => setEntries(data))
      .catch(() => setFailed(true))
      .finally(() => {
        loading.current = false;
      });
  }, [open, entries]);

  const results = entries ? searchPosts(entries, query) : [];

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setActive(0);
    }
  }

  function go(slug: string) {
    handleOpenChange(false);
    router.push(`/posts/${slug}`);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 한글 조합 중의 Enter/방향키는 무시한다.
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].slug);
    }
  }

  const hasQuery = query.trim().length > 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="검색 (단축키: /)"
        title="검색 ( / 또는 Ctrl+K )"
      >
        <Search />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="top-[18%] -translate-y-0 gap-0 p-0 sm:max-w-xl"
        >
          <DialogTitle className="sr-only">글 검색</DialogTitle>
          <DialogDescription className="sr-only">
            제목, 태그, 요약, 본문에서 검색합니다. 방향키로 이동하고 Enter로 엽니다.
          </DialogDescription>

          <div className="flex items-center gap-2 border-b px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="검색어를 입력하세요"
              aria-label="검색어"
              role="combobox"
              aria-expanded={hasQuery && results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={
                results[active] ? `search-opt-${results[active].slug}` : undefined
              }
              className="h-12 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {failed ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                검색 데이터를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.
              </p>
            ) : !hasQuery ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                제목, 태그, 요약, 본문에서 찾습니다.
              </p>
            ) : !entries ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                불러오는 중…
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                “{query.trim()}”에 대한 결과가 없습니다.
              </p>
            ) : (
              <ul id="search-results" role="listbox" aria-label="검색 결과">
                {results.map((r, i) => (
                  <li
                    key={r.slug}
                    id={`search-opt-${r.slug}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(r.slug)}
                    className={cn(
                      "cursor-pointer rounded-md px-3 py-2",
                      i === active && "bg-accent",
                    )}
                  >
                    <p className="font-medium leading-snug">{r.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {r.summary}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(r.date)} · {r.tags.map((t) => `#${t}`).join(" ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

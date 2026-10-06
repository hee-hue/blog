"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// 모달 코드(Dialog 등)는 처음 열 때 불러온다.
const SearchDialog = dynamic(() => import("@/components/search-dialog"), {
  ssr: false,
});

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  // 한 번 열린 뒤에는 닫아도 마운트를 유지해 닫힘 애니메이션과 상태를 보존한다.
  const [everOpened, setEverOpened] = useState(false);

  function show(next: boolean) {
    if (next) setEverOpened(true);
    setOpen(next);
  }

  // 단축키: '/' (입력 중이 아닐 때), Ctrl/Cmd + K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setEverOpened(true);
        setOpen((v) => !v);
      } else if (
        e.key === "/" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !isTypingTarget(e.target)
      ) {
        e.preventDefault();
        setEverOpened(true);
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => show(true)}
        aria-label="검색 (단축키: /)"
        title="검색 ( / 또는 Ctrl+K )"
      >
        <Search />
      </Button>
      {everOpened && <SearchDialog open={open} onOpenChange={show} />}
    </>
  );
}

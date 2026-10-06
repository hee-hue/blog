"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function BookmarkRemoveButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function remove() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setFailed(false);
    const { error } = await supabase.from("bookmarks").delete().eq("post_slug", slug);
    if (error) {
      setFailed(true);
      setBusy(false);
      return;
    }
    router.refresh(); // 서버에서 목록을 다시 불러온다.
  }

  return (
    <div className="shrink-0 text-right">
      <Button variant="outline" size="sm" onClick={remove} disabled={busy}>
        {busy ? "해제 중…" : "북마크 해제"}
      </Button>
      {failed && (
        <p role="alert" className="mt-1 text-xs text-destructive">
          해제하지 못했습니다.
        </p>
      )}
    </div>
  );
}

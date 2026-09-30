"use client";

import { useState } from "react";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

// 목업: 상태는 화면 안에서만 유지된다. 이후 Supabase 연동 시 로그인 확인과 저장을 붙인다.
export function PostActions({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        aria-pressed={liked}
        onClick={() => setLiked((v) => !v)}
      >
        <Heart className={liked ? "fill-current text-link" : ""} />
        좋아요 {initialLikes + (liked ? 1 : 0)}
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={bookmarked}
        onClick={() => setBookmarked((v) => !v)}
      >
        <Bookmark className={bookmarked ? "fill-current text-link" : ""} />
        {bookmarked ? "북마크됨" : "북마크"}
      </Button>
    </div>
  );
}

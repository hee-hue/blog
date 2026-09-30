"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 목업: 실제 이메일 발송은 Supabase 연동 단계에서 구현한다.
export function LoginForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          onChange={() => setSubmitted(false)}
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        로그인 링크 받기
      </Button>
      {submitted && (
        <p role="status" className="text-sm text-muted-foreground">
          로그인 기능은 아직 준비 중입니다. (목업 화면)
        </p>
      )}
    </form>
  );
}

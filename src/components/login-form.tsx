"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeNext } from "@/lib/auth-utils";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    const supabase = createClient();

    if (!supabase) {
      setStatus("error");
      setMessage("로그인 기능이 아직 설정되지 않았습니다.");
      return;
    }

    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(
        error.status === 429
          ? "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."
          : "로그인 링크를 보내지 못했습니다. 이메일 주소를 확인하고 다시 시도해 주세요.",
      );
      return;
    }
    setStatus("sent");
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {status === "idle" && params.get("error") === "expired" && (
        <p role="alert" className="text-sm text-destructive">
          로그인 링크가 만료되었거나 이미 사용되었습니다. 새 링크를 요청해 주세요.
        </p>
      )}
      {status === "idle" && params.get("error") === "auth" && (
        <p role="alert" className="text-sm text-destructive">
          로그인하지 못했습니다. 링크를 요청한 것과 같은 브라우저에서 메일의 링크를 열었는지
          확인하고, 새 링크를 요청해 주세요.
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          onChange={() => status !== "sending" && setStatus("idle")}
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={status === "sending"}>
        {status === "sending" ? "보내는 중…" : "로그인 링크 받기"}
      </Button>
      {status === "sent" && (
        <p role="status" className="text-sm text-link">
          메일을 보냈습니다. 받은 편지함에서 링크를 눌러 로그인하세요.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </form>
  );
}

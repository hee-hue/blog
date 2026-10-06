"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">문제가 발생했습니다</h1>
      <p className="mt-3 text-muted-foreground">
        잠시 후 다시 시도해 주세요. 계속되면 홈으로 돌아가 주세요.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button size="lg" onClick={reset}>
          다시 시도
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          홈으로
        </Link>
      </div>
    </div>
  );
}

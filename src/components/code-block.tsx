"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CodeBlock({
  code,
  lang,
  html,
}: {
  code: string;
  lang: string;
  html: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="my-6 overflow-hidden rounded-md border bg-code">
      <div className="flex items-center justify-between border-b px-3 py-1.5 text-xs text-muted-foreground">
        <span className="font-mono">{lang}</span>
        <Button
          variant="ghost"
          size="xs"
          onClick={copy}
          aria-label="코드 복사"
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "복사됨" : "복사"}
        </Button>
      </div>
      <div
        className="shiki-wrapper overflow-x-auto p-4 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

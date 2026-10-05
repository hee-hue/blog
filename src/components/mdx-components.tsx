import type { ComponentProps, ReactElement, ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { highlight } from "@/lib/highlight";
import { slugifyHeading } from "@/lib/post-utils";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

export const mdxComponents = {
  h2: ({ children }: ComponentProps<"h2">) => (
    <h2
      id={slugifyHeading(textOf(children))}
      className="mb-3 mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight"
    >
      {children}
    </h2>
  ),
  h3: ({ children }: ComponentProps<"h3">) => (
    <h3 className="mb-2 mt-8 text-xl font-semibold tracking-tight">{children}</h3>
  ),
  p: ({ children }: ComponentProps<"p">) => <p className="my-5">{children}</p>,
  ul: ({ children }: ComponentProps<"ul">) => (
    <ul className="my-5 list-disc space-y-1.5 pl-6 marker:text-point">{children}</ul>
  ),
  ol: ({ children }: ComponentProps<"ol">) => (
    <ol className="my-5 list-decimal space-y-1.5 pl-6 marker:text-link">{children}</ol>
  ),
  a: ({ href, children }: ComponentProps<"a">) => (
    <a href={href} className="text-link underline underline-offset-4">
      {children}
    </a>
  ),
  blockquote: ({ children }: ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-point pl-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10" />,
  // 인라인 코드 (블록 코드는 pre 에서 처리)
  code: ({ className, children }: ComponentProps<"code">) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-code px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
  pre: async ({ children }: ComponentProps<"pre">) => {
    const el = children as ReactElement<{ className?: string; children?: ReactNode }>;
    const lang = /language-([\w-]+)/.exec(el.props?.className ?? "")?.[1] ?? "text";
    const code = textOf(el.props?.children).replace(/\n$/, "");
    return <CodeBlock lang={lang} code={code} html={await highlight(code, lang)} />;
  },
};

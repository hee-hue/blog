import type { Block } from "@/lib/mock-posts";

export function Toc({ blocks }: { blocks: Block[] }) {
  const items = blocks.flatMap((b) => (b.type === "h2" ? [b] : []));
  if (items.length === 0) return null;

  return (
    <aside className="absolute left-full top-0 ml-12 hidden h-full w-48 xl:block">
      <nav aria-label="목차" className="sticky top-24 text-sm">
        <p className="mb-3 font-semibold">목차</p>
        <ul className="space-y-2 border-l">
          {items.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className="-ml-px block border-l border-transparent pl-3 text-muted-foreground transition-colors hover:border-point hover:text-link"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

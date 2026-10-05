import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { tagHref } from "@/lib/post-utils";
import { cn } from "@/lib/utils";

const BADGE = "bg-tag font-medium text-tag-foreground";

/** 링크가 아닌 단순 라벨 (예: About 의 기술 스택) */
export function TagBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="secondary" className={cn(BADGE, className)}>
      {children}
    </Badge>
  );
}

/** 태그 페이지(/tags/[tag])로 이동하는 배지 */
export function TagLink({ tag, className }: { tag: string; className?: string }) {
  return (
    <Badge
      variant="secondary"
      render={<Link href={tagHref(tag)} />}
      className={cn(
        BADGE,
        "transition-colors hover:bg-accent hover:text-link hover:ring-1 hover:ring-point",
        className,
      )}
    >
      {tag}
    </Badge>
  );
}

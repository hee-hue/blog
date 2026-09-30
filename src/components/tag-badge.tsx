import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TagBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("bg-tag font-medium text-tag-foreground", className)}
    >
      {children}
    </Badge>
  );
}

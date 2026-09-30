import { Rss } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <a
          href="/rss.xml"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-link"
        >
          <Rss className="size-4" aria-hidden />
          RSS
        </a>
      </div>
    </footer>
  );
}

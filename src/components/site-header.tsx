import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { SearchButton } from "@/components/search-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "Posts" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-4 px-5">
        <Link href="/" className="font-semibold tracking-tight">
          {SITE.name}
        </Link>
        <nav aria-label="주요 메뉴" className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <SearchButton />
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

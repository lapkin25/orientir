import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <span className="block text-lg font-semibold leading-tight">
            ВВГУ.Ориентир
          </span>
          <span className="block text-xs text-muted-foreground">
            Упрощённый навигатор по университету
          </span>
        </Link>
        <ThemeToggle />
      </div>
      <nav aria-label="Разделы сайта" className="mx-auto w-full max-w-2xl px-4 pb-2">
        <SiteNav />
      </nav>
    </header>
  );
}

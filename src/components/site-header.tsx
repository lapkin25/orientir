import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, LocateFixed } from "lucide-react";

const ICON_LINK =
  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteLogo() {
  return (
    <div className="mx-auto w-[70%] max-w-xs py-8">
      <Image
        src="orientir/vvsu-logo.svg"
        alt="ВВГУ"
        width={249}
        height={81}
        priority
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

export function NavigatorHeader() {
  return (
    <header className="px-1 pb-1">
      <div className="flex items-center justify-between gap-3">
        <h1 className="select-none text-[2rem] font-normal leading-tight">
          Ориентир
        </h1>
        <div className="flex items-center gap-1">
          <Link
            href="/location"
            aria-label="Местоположение"
            title="Местоположение"
            className={ICON_LINK}
          >
            <LocateFixed className="h-8 w-8" strokeWidth={1.5} aria-hidden />
          </Link>
          <Link
            href="/directory"
            aria-label="Справочник"
            title="Справочник"
            className={ICON_LINK}
          >
            <BookOpen className="h-8 w-8" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
      <p className="mt-0.5 select-none text-base text-white/90">
        Упрощённый навигатор по университету
      </p>
    </header>
  );
}

export function DirectoryHeader({ title = "Справочник" }: { title?: string }) {
  return (
    <header className="mb-4 flex items-center border-b border-primary/80 pb-1">
      <Link
        href="/"
        aria-label="Назад к навигатору"
        title="Назад"
        className={ICON_LINK}
      >
        <ArrowLeft className="h-7 w-7" aria-hidden />
      </Link>
      <h1 className="mx-auto pr-12 text-2xl font-normal">{title}</h1>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact: boolean;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Навигатор", icon: Compass, exact: true },
  { href: "/directory", label: "Справочник", icon: BookOpen, exact: false },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1">
      {ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

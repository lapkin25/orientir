"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ACTIONS } from "@/lib/navigator/actions";
import { cn } from "@/lib/utils";

export function ActionsMenu() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="space-y-3" aria-label="Действия">
      {ACTIONS.map((action) => {
        const open = openId === action.id;
        const panelId = `action-${action.id}`;
        return (
          <li
            key={action.id}
            className={cn(
              "rounded-[10px] border-2 bg-card transition-colors",
              open ? "border-accent" : "border-primary/80"
            )}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : action.id)}
              className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left text-xl text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[8px]"
            >
              {action.title}
              <ChevronDown
                className={cn(
                  "h-6 w-6 shrink-0 transition-transform motion-reduce:transition-none",
                  open && "rotate-180"
                )}
                aria-hidden
              />
            </button>
            {open && (
              <div id={panelId} className="space-y-3 px-4 pb-4">
                {action.answer.map((line) => (
                  <p key={line} className="text-lg leading-snug text-white/90">
                    {line}
                  </p>
                ))}
                {action.placeId && (
                  <Link
                    href={`/?to=${encodeURIComponent(action.placeId)}`}
                    className="flex h-12 w-full items-center justify-center rounded-full border-2 border-primary/80 text-lg text-white transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:outline-none"
                  >
                    Как добраться
                  </Link>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

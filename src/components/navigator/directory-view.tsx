"use client";

import { useState } from "react";
import { ActionsMenu } from "@/components/navigator/actions-menu";
import { ContentCatalog } from "@/components/navigator/content-catalog";
import type { ContentEntry } from "@/lib/navigator/content";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "places", title: "Места" },
  { id: "actions", title: "Действия" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DirectoryView({ entries }: { entries: ContentEntry[] }) {
  const [tab, setTab] = useState<TabId>("places");

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Разделы справочника" className="grid grid-cols-2 gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={cn(
              "min-h-12 rounded-full border-2 px-3 text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tab === item.id
                ? "border-accent bg-card text-white"
                : "border-primary/80 text-white/80 hover:border-accent"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "actions" ? <ActionsMenu /> : <ContentCatalog entries={entries} />}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CONTENT_CATEGORIES,
  CONTENT_CATEGORY_TITLES,
  KIND_LABELS,
  searchContent,
  type ContentEntry,
} from "@/lib/navigator/content";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 24;

function EntryCard({ entry }: { entry: ContentEntry }) {
  const typeLabel =
    entry.category === "other"
      ? KIND_LABELS[entry.kind]
      : (CONTENT_CATEGORY_TITLES.get(entry.category) ?? "Прочее");
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold leading-snug">{entry.name}</p>
          <p className="text-xs text-muted-foreground">Тип: {typeLabel}</p>
          <p className="text-xs text-muted-foreground">
            Расположение: {entry.floor} этаж
            {entry.location ? `, ${entry.location}` : ""}
          </p>
        </div>
        <Button asChild size="sm" className="w-full">
          <Link href={`/?to=${encodeURIComponent(entry.id)}`}>
            Как добраться
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Каталог ориентиров: поиск и категории из content1._tsx.
// Кнопка «Как добраться» открывает навигатор с выбранной точкой назначения.
export function ContentCatalog({ entries }: { entries: ContentEntry[] }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const availableCategories = useMemo(() => {
    const used = new Set(entries.map((entry) => entry.category));
    return CONTENT_CATEGORIES.filter(
      (item) => item.id !== "other" && used.has(item.id)
    );
  }, [entries]);

  const results = useMemo(
    () => searchContent(entries, query, category),
    [entries, query, category]
  );
  const shown = results.slice(0, MAX_RESULTS);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по каталогу: диван, туалет, кафедра…"
          aria-label="Поиск по каталогу ориентиров"
          autoComplete="off"
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          aria-pressed={category === "all"}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            category === "all"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
        >
          Всё
        </button>
        {availableCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            aria-pressed={category === item.id}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition-colors",
              category === item.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
      {results.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Ничего не найдено. Попробуйте другую категорию или слово.
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {shown.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
          {results.length > shown.length && (
            <p className="text-xs text-muted-foreground">
              Показаны первые {shown.length} из {results.length}. Уточните
              запрос или выберите категорию.
            </p>
          )}
        </>
      )}
    </div>
  );
}

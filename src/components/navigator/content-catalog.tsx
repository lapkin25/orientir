"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
    <Card className="rounded-[10px] border-2 border-primary/80 bg-card shadow-none">
      <CardContent className="space-y-3 p-4">
        {entry.photo && (
          <Image
            src={`/${entry.photo}`}
            alt={entry.name}
            width={640}
            height={360}
            className="w-full rounded-[10px] object-cover"
          />
        )}
        <div className="space-y-1">
          <p className="text-xl leading-snug">{entry.name}</p>
          <p className="text-base text-muted-foreground">Тип: {typeLabel}</p>
          <p className="text-base text-muted-foreground">
            {entry.kind === "section" ? "Отсек: " : "Расположение: "}
            {entry.floor} этаж
            {entry.location
              ? entry.kind === "section"
                ? `; включает: ${entry.location}`
                : `, ${entry.location}`
              : ""}
          </p>
          {entry.desc && (
            <p className="pt-1 text-base leading-snug text-white/90">
              {entry.desc}
            </p>
          )}
        </div>
        <Button asChild className="h-12 w-full rounded-full border-2 border-primary/80 bg-card text-lg text-white hover:border-accent hover:bg-card hover:text-accent">
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
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск по каталогу: диван, туалет, кафедра…"
          aria-label="Поиск по каталогу ориентиров"
          autoComplete="off"
          className="h-12 rounded-[10px] border-2 border-primary/80 bg-card pl-10 text-lg placeholder:text-[#d9d4d4] focus-visible:border-accent focus-visible:ring-0 md:text-lg"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          aria-pressed={category === "all"}
          className={cn(
            "rounded-full border-2 px-3 py-1 text-base transition-colors",
            category === "all"
              ? "border-accent bg-card text-white"
              : "border-primary/80 text-white/80 hover:border-accent"
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
              "rounded-full border-2 px-3 py-1 text-base transition-colors",
              category === item.id
                ? "border-accent bg-card text-white"
                : "border-primary/80 text-white/80 hover:border-accent"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>
      {results.length === 0 ? (
        <p className="text-lg text-muted-foreground">
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
            <p className="text-base text-muted-foreground">
              Показаны первые {shown.length} из {results.length}. Уточните
              запрос или выберите категорию.
            </p>
          )}
        </>
      )}
    </div>
  );
}

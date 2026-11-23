"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff, MapPin, Search, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
        <div className="flex flex-col items-stretch gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={`${entry.name}: подробнее об ориентире`}
                className="flex items-center gap-1 self-end rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ZoomIn className="h-4 w-4" aria-hidden />
                Подробнее
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden />
                  {entry.name}
                </DialogTitle>
                <DialogDescription>
                  {typeLabel}, {entry.floor} этаж
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border p-2">
                  <dt className="text-xs text-muted-foreground">Тип</dt>
                  <dd className="font-medium">{typeLabel}</dd>
                </div>
                <div className="rounded-md border p-2">
                  <dt className="text-xs text-muted-foreground">Этаж</dt>
                  <dd className="font-medium">{entry.floor} этаж</dd>
                </div>
                {entry.location && (
                  <div className="col-span-2 rounded-md border p-2">
                    <dt className="text-xs text-muted-foreground">
                      {entry.kind === "section" ? "Включает" : "Расположение"}
                    </dt>
                    <dd className="font-medium">{entry.location}</dd>
                  </div>
                )}
              </dl>
              {entry.photo ? (
                <Image
                  src={`/${entry.photo}`}
                  alt={entry.name}
                  width={640}
                  height={360}
                  className="w-full rounded-lg border object-cover"
                />
              ) : (
                <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground">
                  <ImageOff className="h-5 w-5" aria-hidden />
                  Фотография ориентира пока не добавлена
                </div>
              )}
              {entry.desc && (
                <p className="text-sm leading-snug text-muted-foreground">
                  {entry.desc}
                </p>
              )}
              <Button
                asChild
                className="h-12 w-full rounded-full border-2 border-primary/80 bg-card text-lg text-white hover:border-accent hover:bg-card hover:text-accent"
              >
                <Link href={`/?to=${encodeURIComponent(entry.id)}`}>
                  Как добраться
                </Link>
              </Button>
            </DialogContent>
          </Dialog>
          <Button
            asChild
            className="h-12 w-full rounded-full border-2 border-primary/80 bg-card text-lg text-white hover:border-accent hover:bg-card hover:text-accent"
          >
            <Link href={`/?to=${encodeURIComponent(entry.id)}`}>
              Как добраться
            </Link>
          </Button>
        </div>
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

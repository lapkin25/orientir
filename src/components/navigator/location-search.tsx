"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DoorOpen, MapPin, Search } from "lucide-react";
import type { Place } from "@/lib/navigator/graph";

const MAX_RESULTS = 30;

// Экран «Местоположение»: пользователь находит, где он сейчас,
// и эта точка подставляется в поле «Откуда» навигатора.
export function LocationSearch({ places }: { places: Place[] }) {
  const [query, setQuery] = useState("");

  const entrances = useMemo(
    () => places.filter((place) => place.kind === "exit"),
    [places]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(q) ||
        (place.description?.toLowerCase().includes(q) ?? false)
    );
  }, [places, query]);
  const shown = results.slice(0, MAX_RESULTS);

  return (
    <div className="space-y-3">
      <p className="text-lg text-white/90">
        Где вы сейчас? Введите номер аудитории или ближайший ориентир.
      </p>
      {entrances.length > 0 && (
        <div className="space-y-2">
          <p className="text-base text-white/80">Вы входите в здание?</p>
          <div className="grid gap-2">
            {entrances.map((place) => (
              <Link
                key={place.id}
                href={`/?from=${encodeURIComponent(place.id)}`}
                className="flex items-center gap-3 rounded-[10px] border-2 border-primary/80 bg-card px-3 py-3 transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-none"
              >
                <DoorOpen className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1 text-lg leading-snug">
                  {place.name}
                </span>
                <span className="shrink-0 text-base text-accent">Я здесь</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск: 4407, диван, лестница…"
          aria-label="Поиск местоположения"
          autoComplete="off"
          autoFocus
          className="h-14 w-full rounded-[10px] border-2 border-primary/80 bg-card pl-10 pr-3 text-lg text-white outline-none transition-colors placeholder:text-[#d9d4d4] hover:border-accent focus:border-accent"
        />
      </div>
      {query.trim() !== "" && results.length === 0 && (
        <p className="text-lg text-muted-foreground">
          Ничего не найдено. Попробуйте другое слово.
        </p>
      )}
      {shown.length > 0 && (
        <ul aria-label="Результаты поиска" className="space-y-2">
          {shown.map((place) => (
            <li key={place.id}>
              <Link
                href={`/?from=${encodeURIComponent(place.id)}`}
                className="flex items-center gap-3 rounded-[10px] border-2 border-primary/80 bg-card px-3 py-3 transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline-none"
              >
                <MapPin className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-lg leading-snug">{place.name}</span>
                  <span className="block text-base text-muted-foreground">
                    {place.floor} этаж
                    {place.description ? `, ${place.description}` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-base text-accent">Я здесь</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {results.length > shown.length && (
        <p className="text-base text-muted-foreground">
          Показаны первые {shown.length} из {results.length}. Уточните запрос.
        </p>
      )}
    </div>
  );
}

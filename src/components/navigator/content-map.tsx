import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Place, PlaceKind } from "@/lib/navigator/graph";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<PlaceKind, string> = {
  room: "Аудитория",
  orient: "Ориентир",
  square: "Площадка",
  corridor: "Коридор",
};

interface ContentMapProps {
  places: Place[];
  onSelect: (place: Place) => void;
}

// Контент-карта: поиск по смысловому наполнению здания.
// Найденная точка выбирается конечным ориентиром маршрута.
export function ContentMap({ places, onSelect }: ContentMapProps) {
  const [text, setText] = useState("");
  const [active, setActive] = useState(-1);

  const matches = useMemo(() => {
    const query = text.trim().toLowerCase();
    if (!query) return [];
    const filtered = places.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        KIND_LABELS[place.kind].toLowerCase().includes(query)
    );
    return filtered.slice(0, 30);
  }, [places, text]);

  const pick = (place: Place) => {
    setText(place.name);
    setActive(-1);
    onSelect(place);
  };

  return (
    <Card>
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Контент-карта
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Поиск по смысловому наполнению здания: аудитории, ориентиры,
            коридоры. Найденная точка станет пунктом назначения.
          </p>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={text}
            placeholder="Поиск по зданию: кафе, 4407, огнетушитель…"
            aria-label="Поиск по зданию"
            autoComplete="off"
            className="pl-9"
            onChange={(event) => {
              setText(event.target.value);
              setActive(-1);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setText("");
                setActive(-1);
                return;
              }
              if (event.key === "Enter" && matches.length > 0) {
                event.preventDefault();
                pick(matches[active >= 0 ? active : 0]);
              } else if (event.key === "ArrowDown" && matches.length > 0) {
                event.preventDefault();
                setActive((prev) => Math.min(prev + 1, matches.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((prev) => Math.max(prev - 1, 0));
              }
            }}
          />
        </div>
        {text.trim() === "" ? (
          <p className="text-xs text-muted-foreground">
            Введите тип ориентира, название аудитории или её номер.
          </p>
        ) : matches.length === 0 ? (
          <p className="text-xs text-muted-foreground">Ничего не найдено</p>
        ) : (
          <ul
            aria-label="Результаты поиска"
            className="max-h-64 space-y-1 overflow-y-auto"
          >
            {matches.map((place, index) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => pick(place)}
                  onMouseEnter={() => setActive(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md border bg-background px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    index === active && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="min-w-0 truncate">{place.name}</span>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="text-xs font-normal text-muted-foreground"
                    >
                      {KIND_LABELS[place.kind]}
                    </Badge>
                    {place.floor} эт.
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

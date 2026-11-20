"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpToLine,
  ChevronDown,
  CornerUpLeft,
  CornerUpRight,
  Footprints,
  MapPin,
  Navigation2,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  findRoute,
  type Place,
  type RouteResult,
  type StepIcon,
} from "@/lib/navigator/graph";
import { cn } from "@/lib/utils";

const STEP_ICONS: Record<StepIcon, LucideIcon> = {
  start: Footprints,
  straight: Navigation2,
  left: CornerUpLeft,
  right: CornerUpRight,
  back: RotateCcw,
  "stairs-up": ArrowUpToLine,
  "stairs-down": ArrowDownToLine,
  finish: MapPin,
};

interface PlaceFieldProps {
  id: string;
  label: string;
  selected: Place | null;
  onSelect: (place: Place) => void;
  places: Place[];
  disabled?: boolean;
}

function PlaceField({
  id,
  label,
  selected,
  onSelect,
  places,
  disabled,
}: PlaceFieldProps) {
  const [text, setText] = useState(selected ? selected.name : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const matches = useMemo(() => {
    const query = text.trim().toLowerCase();
    const filtered = query
      ? places.filter((p) => p.name.toLowerCase().includes(query))
      : places;
    return filtered.slice(0, 30);
  }, [places, text]);

  const pick = (place: Place) => {
    setText(place.name);
    setActive(-1);
    setOpen(false);
    onSelect(place);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        value={text}
        placeholder={label}
        aria-label={label}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        disabled={disabled}
        onChange={(event) => {
          setText(event.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            return;
          }
          if (!open || matches.length === 0) {
            return;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((prev) => Math.min(prev + 1, matches.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((prev) => Math.max(prev - 1, 0));
          } else if (event.key === "Enter") {
            event.preventDefault();
            pick(matches[active >= 0 ? active : 0]);
          }
        }}
      />
      {open && !disabled && matches.length > 0 && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {matches.map((place, index) => (
            <li key={place.id} role="option" aria-selected={selected?.id === place.id}>
              <button
                type="button"
                onClick={() => pick(place)}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm outline-none",
                  index === active && "bg-accent text-accent-foreground"
                )}
              >
                <span className="truncate">{place.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {place.floor} эт.
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !disabled && matches.length === 0 && (
        <div className="absolute z-20 mt-1.5 w-full rounded-md border bg-popover p-3 text-sm text-muted-foreground shadow-md">
          Ничего не найдено
        </div>
      )}
    </div>
  );
}

function RouteCard({ result }: { result: RouteResult }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4 sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Маршрут
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="max-w-full">
              <span className="truncate">{result.fromName}</span>
            </Badge>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Badge variant="secondary" className="max-w-full">
              <span className="truncate">{result.toName}</span>
            </Badge>
          </div>
        </div>
        <ol className="space-y-3">
          {result.steps.map((step, index) => {
            const Icon = STEP_ICONS[step.icon];
            return (
              <li key={index} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-sm leading-snug">{step.text}</p>
                  {step.detail && (
                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                  )}
                  {step.photo && (
                    <figure className="space-y-1">
                      <Image
                        src={`/${step.photo}`}
                        alt={step.photoNote ?? ""}
                        width={640}
                        height={360}
                        className="w-full max-w-sm rounded-lg border object-cover"
                      />
                      {step.photoNote && (
                        <figcaption className="text-xs text-muted-foreground">
                          {step.photoNote}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

function Catalog({
  places,
  onPick,
}: {
  places: Place[];
  onPick: (place: Place) => void;
}) {
  const [open, setOpen] = useState(false);
  const floors = useMemo(() => {
    const map = new Map<number, Place[]>();
    for (const place of places) {
      const list = map.get(place.floor) ?? [];
      list.push(place);
      map.set(place.floor, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [places]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          Справочник точек
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2">
          <CardContent className="max-h-80 space-y-4 overflow-y-auto p-4">
            <p className="text-xs text-muted-foreground">
              Нажмите на точку, чтобы выбрать её пунктом назначения. Полный
              список —{" "}
              <Link
                href="/directory"
                className="underline underline-offset-2 hover:text-foreground"
              >
                в справочнике
              </Link>
              .
            </p>
            {floors.map(([floor, list]) => (
              <div key={floor}>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {floor} этаж
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => onPick(place)}
                      className="rounded-md border px-2.5 py-1 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {place.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Navigator({ places }: { places: Place[] }) {
  const [from, setFrom] = useState<Place | null>(null);
  const [to, setTo] = useState<Place | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const hasResult = result !== null;

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  const submit = () => {
    if (hasResult) {
      setFrom(null);
      setTo(null);
      clearResult();
      setResetKey((key) => key + 1);
      return;
    }
    if (!from || !to) {
      setError("Выберите точки отправления и назначения из подсказок");
      return;
    }
    try {
      setError(null);
      setResult(findRoute(from.id, to.id));
    } catch (caught) {
      setResult(null);
      setError(
        caught instanceof Error
          ? caught.message
          : "Не удалось проложить маршрут"
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-4 sm:p-5">
          <div className="grid gap-3">
            <PlaceField
              key={`from-${resetKey}`}
              id="route-from"
              label="Откуда"
              selected={from}
              onSelect={(place) => {
                setFrom(place);
                setError(null);
              }}
              places={places}
              disabled={hasResult}
            />
            <PlaceField
              key={`to-${resetKey}`}
              id="route-to"
              label="Куда"
              selected={to}
              onSelect={(place) => {
                setTo(place);
                setError(null);
              }}
              places={places}
              disabled={hasResult}
            />
          </div>
          <Button onClick={submit} className="w-full">
            {hasResult ? "Проложить новый маршрут" : "Проложить маршрут"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {hasResult && <RouteCard result={result} />}

      <Catalog
        places={places}
        onPick={(place) => {
          clearResult();
          setTo(place);
          setResetKey((key) => key + 1);
        }}
      />
    </div>
  );
}

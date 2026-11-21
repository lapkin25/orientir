"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  EllipsisVertical,
  Map as MapIcon,
  MapPin,
  Search,
} from "lucide-react";
import {
  findRoute,
  type NodeLandmark,
  type Place,
  type RouteNode,
  type RouteResult,
} from "@/lib/navigator/graph";
import { MacroMap } from "@/components/navigator/macro-map";
import { MicroMapCorridor } from "@/components/navigator/micro-map-corridor";
import { MicroMapSquare } from "@/components/navigator/micro-map-square";
import { MicroMapStairs } from "@/components/navigator/micro-map-stairs";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "orientir:selection";

function readSaved(): { from?: string; to?: string } {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveSelection(from: Place | null, to: Place | null) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ from: from?.id, to: to?.id })
    );
  } catch {
    // Хранилище может быть недоступно (приватный режим) — просто не запоминаем.
  }
}

function subscribeToLocation(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

interface PlaceFieldProps {
  id: string;
  label: string;
  selected: Place | null;
  onSelect: (place: Place) => void;
  onSubmit: () => void;
  places: Place[];
}

function PlaceField({
  id,
  label,
  selected,
  onSelect,
  onSubmit,
  places,
}: PlaceFieldProps) {
  const [text, setText] = useState(selected ? selected.name : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const matches = useMemo(() => {
    const query = text.trim().toLowerCase();
    if (!query) return [];
    return places
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 30);
  }, [places, text]);

  const showList = open && matches.length > 0;

  const pick = (place: Place) => {
    setText(place.name);
    setActive(-1);
    setOpen(false);
    onSelect(place);
  };

  return (
    <div className="relative">
      <input
        id={id}
        value={text}
        placeholder={label}
        aria-label={label}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
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
          if (event.key === "Enter") {
            event.preventDefault();
            if (showList) {
              pick(matches[active >= 0 ? active : 0]);
            } else {
              onSubmit();
            }
            return;
          }
          if (!showList) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((prev) => Math.min(prev + 1, matches.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((prev) => Math.max(prev - 1, 0));
          }
        }}
        className={cn(
          "w-full rounded-[10px] border-2 border-primary/80 bg-card px-3 py-3 text-lg text-white outline-none transition-[border-color,border-radius] placeholder:text-[#d9d4d4] hover:border-accent focus:border-accent",
          showList && "rounded-b-none"
        )}
      />
      {showList && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          className="absolute z-20 -mt-0.5 max-h-60 w-full overflow-y-auto rounded-b-[10px] border-2 border-t-0 border-accent bg-card shadow-lg"
        >
          {matches.map((place, index) => (
            <li
              key={place.id}
              role="option"
              aria-selected={selected?.id === place.id}
            >
              <button
                type="button"
                onClick={() => pick(place)}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 border-b border-primary/30 px-3 py-2.5 text-left text-lg font-medium text-white outline-none",
                  index === active && "bg-[#1481d7]/30"
                )}
              >
                <span className="truncate">{place.name}</span>
                <span className="shrink-0 text-sm font-normal text-white/70">
                  {place.floor} эт.
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const STEP_BUTTON =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-expanded:text-accent";

const DIRECTION_ICON = {
  forward: ArrowUp,
  left: ArrowLeft,
  right: ArrowRight,
  back: ArrowDown,
} as const;

const DIRECTION_LABEL: Record<NodeLandmark["direction"], string> = {
  forward: "впереди",
  left: "слева",
  right: "справа",
  back: "позади",
};

function RouteNodeCard({ node }: { node: RouteNode }) {
  const [schemeOpen, setSchemeOpen] = useState(false);
  if (node.landmarks.length === 0 && !node.scheme) return null;

  return (
    <div className="mt-2 rounded-[10px] border-2 border-primary/80 bg-card px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span>
            Узловая точка: {node.name}
            <span className="text-white/70">, {node.floor} этаж</span>
          </span>
        </p>
        {node.scheme && (
          <button
            type="button"
            aria-label="Путевая схема"
            title="Путевая схема"
            aria-expanded={schemeOpen}
            onClick={() => setSchemeOpen((v) => !v)}
            className={STEP_BUTTON}
          >
            <MapIcon className="h-7 w-7" strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>
      {node.landmarks.length > 0 && (
        <ul aria-label="Ближайшие ориентиры" className="mt-1 space-y-1">
          {node.landmarks.map((item) => {
            const Icon = DIRECTION_ICON[item.direction];
            return (
              <li
                key={`${item.direction}-${item.label}`}
                className="flex items-center gap-2 text-lg leading-snug"
              >
                <Icon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span>
                  {item.label}
                  <span className="text-white/70">
                    {" — "}
                    {DIRECTION_LABEL[item.direction]}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {schemeOpen && node.scheme && (
        <Image
          src={`/${node.scheme}`}
          alt={`Путевая схема: ${node.name}`}
          width={640}
          height={360}
          className="mt-2 w-full rounded-[10px] object-cover"
        />
      )}
    </div>
  );
}

function RouteStepItem({
  step,
  arrived = false,
}: {
  step: RouteResult["steps"][number];
  arrived?: boolean;
}) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const showMacro = step.map?.kind === "square" && !!step.map.macro && !arrived;
  const hasDetail = !!step.detail || !!step.map;

  return (
    <li className="my-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex-1 border-l-2 border-primary/80 px-2 py-1 text-xl leading-snug">
          {step.text}
        </p>
        {step.photo && (
          <button
            type="button"
            aria-label="Лупа: показать фото"
            title="Показать фото"
            aria-expanded={photoOpen}
            onClick={() => setPhotoOpen((v) => !v)}
            className={STEP_BUTTON}
          >
            <Search className="h-7 w-7" strokeWidth={2.25} aria-hidden />
          </button>
        )}
        {hasDetail && (
          <button
            type="button"
            aria-label="Подробнее"
            title="Подробнее"
            aria-expanded={detailOpen}
            onClick={() => setDetailOpen((v) => !v)}
            className={STEP_BUTTON}
          >
            <EllipsisVertical className="h-7 w-7" strokeWidth={2.5} aria-hidden />
          </button>
        )}
      </div>
      {step.node && <RouteNodeCard node={step.node} />}
      {photoOpen && step.photo && (
        <figure className="mt-1 space-y-1 border-l-2 border-accent px-2 py-1">
          <Image
            src={`/${step.photo}`}
            alt={step.photoNote ?? "Фото ориентира"}
            width={640}
            height={360}
            className="w-full rounded-[10px] object-cover"
          />
          {step.photoNote && (
            <figcaption className="text-base text-white/85">
              {step.photoNote}
            </figcaption>
          )}
        </figure>
      )}
      {detailOpen && hasDetail && (
        <div className="mt-1 space-y-2 border-l-2 border-accent px-2 py-1 text-lg">
          {step.detail && <p>{step.detail}</p>}
          {step.map?.kind === "square" && <MicroMapSquare map={step.map} />}
          {step.map?.kind === "square" && showMacro && step.map.macro && (
            <MacroMap neighbors={step.map.macro} />
          )}
          {step.map?.kind === "corridor" && (
            <MicroMapCorridor map={step.map} />
          )}
          {step.map?.kind === "stairs" && <MicroMapStairs map={step.map} />}
        </div>
      )}
    </li>
  );
}

function RouteOutput({ result }: { result: RouteResult }) {
  return (
    <section aria-label="Маршрут" className="mt-2">
      <div className="mx-6 border-t-2 border-primary/80" />
      <h2 className="mb-2 mt-3 text-center text-xl">Маршрут</h2>
      <div className="flex items-center justify-center gap-2">
        <span className="min-w-10 rounded-md border-2 border-primary/80 bg-card px-2 py-1 text-center text-lg leading-tight">
          {result.fromName}
        </span>
        <ArrowRight className="h-8 w-8 shrink-0" aria-hidden />
        <span className="min-w-10 rounded-md border-2 border-primary/80 bg-card px-2 py-1 text-center text-lg leading-tight">
          {result.toName}
        </span>
      </div>
      <ol>
        {result.steps.map((step, index) => (
          <RouteStepItem
            key={index}
            step={step}
            arrived={index === result.steps.length - 2}
          />
        ))}
      </ol>
    </section>
  );
}

export function Navigator({ places }: { places: Place[] }) {
  const [from, setFrom] = useState<Place | null>(null);
  const [to, setTo] = useState<Place | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const hasResult = result !== null;

  // Точки из адреса (/?from=…, /?to=…) и ранее выбранные точки подставляем
  // только после гидратации: снимок сервера отличается от снимка браузера,
  // поэтому начальный рендер совпадает, а чтение хранилища идёт уже в браузере.
  const search = useSyncExternalStore(
    subscribeToLocation,
    () => `client:${window.location.search}`,
    () => "server"
  );
  const [appliedSearch, setAppliedSearch] = useState("server");
  if (search !== appliedSearch) {
    setAppliedSearch(search);
    const params = new URLSearchParams(search.slice("client:".length));
    const saved = readSaved();
    const pick = (id: string | null | undefined) =>
      id ? (places.find((place) => place.id === id) ?? null) : null;
    const nextFrom = pick(params.get("from")) ?? pick(saved.from) ?? from;
    const nextTo = pick(params.get("to")) ?? pick(saved.to) ?? to;
    if (nextFrom !== from || nextTo !== to) {
      setFrom(nextFrom);
      setTo(nextTo);
      saveSelection(nextFrom, nextTo);
      setResetKey((key) => key + 1);
    }
  }

  const submit = () => {
    if (hasResult) {
      setFrom(null);
      setTo(null);
      saveSelection(null, null);
      setResult(null);
      setError(null);
      setResetKey((key) => key + 1);
      return;
    }
    if (!from || !to) {
      setError("Выберите точки «Откуда» и «Куда» из подсказок");
      return;
    }
    try {
      setError(null);
      setResult(findRoute(from.id, to.id));
    } catch (caught) {
      setResult(null);
      setError(
        caught instanceof Error ? caught.message : "Не удалось проложить маршрут"
      );
    }
  };

  return (
    <div className="px-1 pb-4">
      <form
        className="space-y-2.5 pt-2.5 text-center"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {!hasResult && (
          <>
            <PlaceField
              key={`from-${resetKey}`}
              id="route-from"
              label="Откуда"
              selected={from}
              onSelect={(place) => {
                setFrom(place);
                saveSelection(place, to);
                setError(null);
              }}
              onSubmit={submit}
              places={places}
            />
            <PlaceField
              key={`to-${resetKey}`}
              id="route-to"
              label="Куда"
              selected={to}
              onSelect={(place) => {
                setTo(place);
                saveSelection(from, place);
                setError(null);
              }}
              onSubmit={submit}
              places={places}
            />
          </>
        )}
        <button
          type="submit"
          className="mb-1 mt-4 min-h-[56px] w-full rounded-full border-[3px] border-primary/80 bg-card px-3 text-lg text-white/95 transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:outline-none"
        >
          {hasResult ? "Проложить новый маршрут" : "Проложить маршрут"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-center text-lg text-destructive">
          {error}
        </p>
      )}
      {hasResult && <RouteOutput result={result} />}
    </div>
  );
}

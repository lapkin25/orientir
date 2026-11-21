import Image from "next/image";
import { ArrowDown, ArrowUp, Footprints, ImageOff, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { StairsMapData } from "@/lib/navigator/graph";
import { cn } from "@/lib/utils";

function floorName(floor: number): string {
  return floor <= 0 ? "Цоколь" : `${floor} этаж`;
}

const RAILING_TEXT: Record<string, string> = {
  both: "С обеих сторон",
  left: "Слева",
  right: "Справа",
  none: "Нет",
};

export function MicroMapStairs({ map }: { map: StairsMapData }) {
  const { stairs, fromFloor, toFloor, direction, label, photo } = map;
  const up = direction === "up";
  const Arrow = up ? ArrowUp : ArrowDown;
  const top = up ? toFloor : fromFloor;
  const bottom = up ? fromFloor : toFloor;
  const railing = stairs.railing
    ? (RAILING_TEXT[stairs.railing] ?? stairs.railing)
    : "Нет данных";
  const width = stairs.width ? `${stairs.width} м` : "Нет данных";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`${label}: подробнее о лестнице`}
          className="group flex w-28 flex-col items-stretch rounded-lg border bg-muted/30 p-2 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="rounded-md border bg-background px-2 py-1 text-center text-[11px] font-medium">
            {floorName(top)}
          </span>
          <span className="relative my-1 flex h-24 items-center justify-center">
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 rounded-sm bg-[repeating-linear-gradient(to_bottom,hsl(var(--border))_0,hsl(var(--border))_2px,transparent_2px,transparent_9px)]"
            />
            <span
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm",
                up ? "motion-safe:group-hover:-translate-y-1" : "motion-safe:group-hover:translate-y-1",
                "transition-transform"
              )}
            >
              <Arrow className="h-4 w-4" aria-hidden />
            </span>
          </span>
          <span className="rounded-md border bg-background px-2 py-1 text-center text-[11px] font-medium">
            {floorName(bottom)}
          </span>
          <span className="mt-1.5 text-center text-[11px] font-medium leading-tight">
            {label}
          </span>
          <span className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground group-hover:text-primary">
            <ZoomIn className="h-3 w-3" aria-hidden />
            Подробнее
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Footprints className="h-4 w-4 text-primary" aria-hidden />
            {label}
          </DialogTitle>
          <DialogDescription>
            Лестница {stairs.building ? `корпуса ${stairs.building}` : ""}:{" "}
            {floorName(fromFloor).toLowerCase()} → {floorName(toFloor).toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border p-2">
            <dt className="text-xs text-muted-foreground">Перила</dt>
            <dd className="font-medium">{railing}</dd>
          </div>
          <div className="rounded-md border p-2">
            <dt className="text-xs text-muted-foreground">Ширина пролёта</dt>
            <dd className="font-medium">{width}</dd>
          </div>
        </dl>
        {photo ? (
          <Image
            src={`/${photo}`}
            alt={`Лестничный марш: ${label.toLowerCase()}`}
            width={640}
            height={360}
            className="w-full rounded-lg border object-cover"
          />
        ) : (
          <div className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground">
            <ImageOff className="h-5 w-5" aria-hidden />
            Фотография лестничного марша пока не добавлена
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

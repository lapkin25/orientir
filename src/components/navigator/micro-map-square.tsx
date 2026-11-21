import { Footprints, Navigation2 } from "lucide-react";
import type { SquareMapData } from "@/lib/navigator/graph";
import type { Dir, SideObject } from "@/lib/navigator/parse-plan";

// Порядок сторон по часовой стрелке — как в SIDE_INDEX графа маршрутов.
const CLOCKWISE: Dir[] = ["forward", "right", "backward", "left"];

// Слот стороны на карте: 0 — верх (прямо), 1 — справа, 2 — низ (пользователь), 3 — слева.
const TURN_SLOT = { straight: 0, right: 1, back: 2, left: 3 } as const;

const TURN_WORD: Record<SquareMapData["turn"], string> = {
  straight: "Прямо",
  right: "Направо",
  left: "Налево",
  back: "Назад",
};

const TURN_ANGLE: Record<SquareMapData["turn"], number> = {
  straight: 0,
  right: 90,
  back: 180,
  left: 270,
};

function objectLabel(obj: SideObject): string {
  if (obj.kind === "joint") return obj.text || "Стык";
  if (obj.kind === "orient") return obj.name;
  return obj.name || (obj.num ? `Ауд. ${obj.num}` : "");
}

function SlotChips({ labels, isExit }: { labels: string[]; isExit: boolean }) {
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {labels.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className={
            isExit
              ? "rounded border border-primary/50 bg-primary/5 px-1.5 py-0.5 text-xs leading-tight"
              : "rounded border bg-background px-1.5 py-0.5 text-xs leading-tight text-muted-foreground"
          }
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function MicroMapSquare({ map }: { map: SquareMapData }) {
  const { square, standSide, turn } = map;
  // Пользователь смотрит с места входа на противоположную сторону, поэтому
  // карту разворачиваем так, чтобы сторона входа оказалась внизу.
  const standIndex = standSide ? CLOCKWISE.indexOf(standSide) : -1;
  const facing = standIndex >= 0 ? (standIndex + 2) % 4 : 0;
  const slotOf = (dir: Dir) =>
    (CLOCKWISE.indexOf(dir) - facing + 4) % 4;

  const slots: string[][] = [[], [], [], []];
  for (const side of square.sides) {
    const slot = slotOf(side.dir);
    for (const obj of side.objects) {
      const label = objectLabel(obj);
      if (label) slots[slot].push(label);
    }
  }
  const exitSlot = TURN_SLOT[turn];
  const vertical = (slot: 0 | 2) => (
    <SlotChips labels={slots[slot]} isExit={slot === exitSlot} />
  );
  const horizontal = (slot: 1 | 3) => (
    <SlotChips
      labels={slots[slot]}
      isExit={slot === exitSlot}
    />
  );

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs font-medium">
        {square.name || "Площадка"}{" "}
        <span className="font-normal text-muted-foreground">
          · {square.building}, {square.floor} этаж
        </span>
      </p>
      <div className="mx-auto mt-2 grid max-w-[300px] grid-cols-[minmax(4.5rem,1fr)_auto_minmax(4.5rem,1fr)] items-center gap-x-2 gap-y-1.5">
        <div />
        {vertical(0)}
        <div />
        {horizontal(3)}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-md border-2 border-border bg-background">
          <div className="flex flex-col items-center gap-1">
            <Navigation2
              className="h-5 w-5 text-primary"
              style={{ transform: `rotate(${TURN_ANGLE[turn]}deg)` }}
              aria-hidden
            />
            <span className="text-xs font-medium text-primary">
              {TURN_WORD[turn]}
            </span>
          </div>
          {!standSide && (
            <span className="absolute bottom-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Footprints className="h-3 w-3" aria-hidden /> вы здесь
            </span>
          )}
        </div>
        {horizontal(1)}
        <div />
        <div className="space-y-1">
          {standSide && (
            <p className="flex items-center justify-center gap-1 text-xs font-medium text-primary">
              <Footprints className="h-3 w-3" aria-hidden /> вы здесь
            </p>
          )}
          {vertical(2)}
        </div>
        <div />
      </div>
    </div>
  );
}

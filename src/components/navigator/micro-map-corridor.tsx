import { DoorOpen, Flag } from "lucide-react";
import type { CorridorMapData } from "@/lib/navigator/graph";
import type { CorridorObject } from "@/lib/navigator/parse-plan";

// Сколько ориентиров вдоль стены показываем сразу; остальные — по запросу,
// чтобы длинный коридор не превращался в нечитаемую простыню.
const VISIBLE_LIMIT = 6;

function objectLabel(entry: CorridorObject): string {
  const obj = entry.object;
  if (obj.kind === "joint") return obj.text || "Стык";
  if (obj.kind === "orient") return obj.name;
  if (obj.name && obj.num) return `${obj.name} (${obj.num})`;
  if (obj.name) return obj.name;
  return obj.num ? `Ауд. ${obj.num}` : "";
}

function WallList({ labels }: { labels: string[] }) {
  if (labels.length === 0) {
    return <p className="mt-1 text-sm text-muted-foreground">—</p>;
  }
  const visible = labels.slice(0, VISIBLE_LIMIT);
  const hidden = labels.slice(VISIBLE_LIMIT);
  return (
    <>
      <ul className="mt-1 space-y-1">
        {visible.map((label, index) => (
          <li
            key={`${label}-${index}`}
            className="flex items-start gap-1 text-sm leading-tight"
          >
            <DoorOpen
              className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span>{label}</span>
          </li>
        ))}
      </ul>
      {hidden.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer text-xs font-medium text-primary hover:underline">
            Ещё {hidden.length}
          </summary>
          <ul className="mt-1 space-y-1">
            {hidden.map((label, index) => (
              <li
                key={`${label}-${index}`}
                className="flex items-start gap-1 text-sm leading-tight"
              >
                <DoorOpen
                  className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

export function MicroMapCorridor({ map }: { map: CorridorMapData }) {
  const { corridor, forward, endLabel } = map;
  // При движении от конца коридора к началу левая и правая стены
  // для идущего меняются местами.
  const userWall = (wall: "left" | "right"): "left" | "right" =>
    forward ? wall : wall === "left" ? "right" : "left";

  const walls: Record<"left" | "right", string[]> = { left: [], right: [] };
  for (const entry of corridor.objects) {
    if (entry.wall !== "left" && entry.wall !== "right") continue;
    const label = objectLabel(entry);
    if (label) walls[userWall(entry.wall)].push(label);
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs font-medium">
        {corridor.name || "Коридор"}{" "}
        <span className="font-normal text-muted-foreground">
          · {corridor.building}, {corridor.floor} этаж
        </span>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-md border bg-background p-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            По левую руку
          </p>
          <WallList labels={walls.left} />
        </div>
        <div className="rounded-md border bg-background p-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            По правую руку
          </p>
          <WallList labels={walls.right} />
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1 text-xs font-medium">
        <Flag className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        В конце коридора: {endLabel}
      </p>
    </div>
  );
}

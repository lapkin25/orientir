import { DoorOpen, Flag } from "lucide-react";
import type { CorridorMapData } from "@/lib/navigator/graph";
import type { CorridorObject } from "@/lib/navigator/parse-plan";

function objectLabel(entry: CorridorObject): string {
  const obj = entry.object;
  if (obj.kind === "joint") return obj.text || "Стык";
  if (obj.kind === "orient") return obj.name;
  if (obj.name && obj.num) return `${obj.name} (${obj.num})`;
  if (obj.name) return obj.name;
  return obj.num ? `Ауд. ${obj.num}` : "";
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
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            По левую руку
          </p>
          <ul className="mt-1 space-y-1">
            {walls.left.length === 0 ? (
              <li className="text-[11px] text-muted-foreground">—</li>
            ) : (
              walls.left.map((label, index) => (
                <li
                  key={`${label}-${index}`}
                  className="flex items-start gap-1 text-[11px] leading-tight"
                >
                  <DoorOpen
                    className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span>{label}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-md border bg-background p-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            По правую руку
          </p>
          <ul className="mt-1 space-y-1">
            {walls.right.length === 0 ? (
              <li className="text-[11px] text-muted-foreground">—</li>
            ) : (
              walls.right.map((label, index) => (
                <li
                  key={`${label}-${index}`}
                  className="flex items-start gap-1 text-[11px] leading-tight"
                >
                  <DoorOpen
                    className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span>{label}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <p className="mt-2 flex items-center gap-1 text-xs font-medium">
        <Flag className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        В конце коридора: {endLabel}
      </p>
    </div>
  );
}

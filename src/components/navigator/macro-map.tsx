import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import type { MacroNeighbor } from "@/lib/navigator/graph";

const DIRECTION_ICONS: Record<MacroNeighbor["direction"], typeof ArrowUp> = {
  forward: ArrowUp,
  left: ArrowLeft,
  right: ArrowRight,
};

// Макро-карта «Основные направления»: указатель, куда можно выйти
// с площадки и какие ориентиры там есть.
export function MacroMap({ neighbors }: { neighbors: MacroNeighbor[] }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs font-medium">Основные направления</p>
      <ul className="mt-2 space-y-1.5">
        {neighbors.map((neighbor) => {
          const Icon = DIRECTION_ICONS[neighbor.direction];
          return (
            <li key={neighbor.id} className="flex items-start gap-2 text-sm">
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden
              />
              <span className="min-w-0 leading-snug">
                <span className="font-medium">{neighbor.name}</span>
                {neighbor.landmarks.length > 0 && (
                  <span className="text-muted-foreground">
                    {" · "}
                    {neighbor.landmarks.join(", ")}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

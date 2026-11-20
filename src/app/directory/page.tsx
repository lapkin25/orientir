import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  listPlaces,
  type Place,
  type PlaceKind,
} from "@/lib/navigator/graph";

export const metadata: Metadata = {
  title: "Справочник ориентиров — ВВГУ.Ориентир",
  description: "Каталог точек главного корпуса ВВГУ по этажам",
};

const KIND_LABELS: Record<PlaceKind, string> = {
  room: "Аудитория",
  orient: "Ориентир",
  square: "Площадка",
  corridor: "Коридор",
};

export default function DirectoryPage() {
  const places = listPlaces();
  const floors = new Map<number, Place[]>();
  for (const place of places) {
    const list = floors.get(place.floor) ?? [];
    list.push(place);
    floors.set(place.floor, list);
  }
  const floorList = [...floors.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Справочник ориентиров
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Точек в каталоге: {places.length}. Названия сгруппированы по
              этажам главного корпуса.
            </p>
          </div>
          {floorList.map(([floor, list]) => (
            <Card key={floor}>
              <CardContent className="p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {floor} этаж · {list.length}
                </p>
                <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {list.map((place) => (
                    <li
                      key={place.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="min-w-0 truncate text-sm">
                        {place.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs font-normal text-muted-foreground"
                      >
                        {KIND_LABELS[place.kind]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

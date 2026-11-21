import type { Metadata } from "next";
import { ContentCatalog } from "@/components/navigator/content-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildContentEntries } from "@/lib/navigator/content";
import { listPlaces } from "@/lib/navigator/graph";

export const metadata: Metadata = {
  title: "Справочник ориентиров — ВВГУ.Ориентир",
  description: "Каталог точек главного корпуса ВВГУ по категориям и этажам",
};

export default function DirectoryPage() {
  const places = listPlaces();
  const entries = buildContentEntries(places);

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
              Каталог точек главного корпуса: {places.length}. Найдите нужное
              место по категории или поиском — «Как добраться» подставит его
              пунктом назначения в навигаторе.
            </p>
          </div>
          <ContentCatalog entries={entries} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

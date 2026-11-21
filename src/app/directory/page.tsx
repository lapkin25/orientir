import type { Metadata } from "next";
import { ContentCatalog } from "@/components/navigator/content-catalog";
import { DirectoryHeader, SiteLogo } from "@/components/site-header";
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
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-8">
      <SiteLogo />
      <main>
        <DirectoryHeader />
        <ContentCatalog entries={entries} />
      </main>
    </div>
  );
}

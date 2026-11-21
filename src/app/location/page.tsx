import type { Metadata } from "next";
import { LocationSearch } from "@/components/navigator/location-search";
import { DirectoryHeader, SiteLogo } from "@/components/site-header";
import { listPlaces } from "@/lib/navigator/graph";

export const metadata: Metadata = {
  title: "Местоположение — ВВГУ.Ориентир",
  description: "Найдите, где вы находитесь в главном корпусе ВВГУ",
};

export default function LocationPage() {
  const places = listPlaces();

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-8">
      <SiteLogo />
      <main>
        <DirectoryHeader title="Местоположение" />
        <LocationSearch places={places} />
      </main>
    </div>
  );
}

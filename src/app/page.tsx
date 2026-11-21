import { Navigator } from "@/components/navigator/navigator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPlaces } from "@/lib/navigator/graph";

export default async function IndexPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { from, to } = await searchParams;
  const places = listPlaces();
  const pick = (id?: string) =>
    id ? (places.find((place) => place.id === id) ?? null) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <Navigator
          places={places}
          initialFrom={pick(from)}
          initialTo={pick(to)}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

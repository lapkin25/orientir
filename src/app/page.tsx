import { Navigator } from "@/components/navigator/navigator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPlaces } from "@/lib/navigator/graph";

// Статическая сборка не умеет читать параметры адреса на сервере,
// поэтому точки «откуда/куда» из адресной строки подставляет навигатор.
export default function IndexPage() {
  const places = listPlaces();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <Navigator places={places} />
      </main>
      <SiteFooter />
    </div>
  );
}

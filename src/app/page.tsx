import { Navigator } from "@/components/navigator/navigator";
import { NavigatorHeader, SiteLogo } from "@/components/site-header";
import { listPlaces } from "@/lib/navigator/graph";

// Статическая сборка не умеет читать параметры адреса на сервере,
// поэтому точки «откуда/куда» из адресной строки подставляет навигатор.
export default function IndexPage() {
  const places = listPlaces();

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 pb-8">
      <SiteLogo />
      <main>
        <NavigatorHeader />
        <Navigator places={places} />
      </main>
    </div>
  );
}

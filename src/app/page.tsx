import { ThemeToggle } from "@/components/theme-toggle";
import { Navigator } from "@/components/navigator/navigator";
import { listPlaces } from "@/lib/navigator/graph";

export default function IndexPage() {
  const places = listPlaces();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/40">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-lg font-semibold leading-tight">ВВГУ.Ориентир</p>
            <p className="text-xs text-muted-foreground">
              Упрощённый навигатор по университету
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <Navigator places={places} />
      </main>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-2xl px-4 py-3 text-xs text-muted-foreground">
          Главный корпус, этажи 3–5. Маршруты строятся по внутреннему плану
          здания.
        </div>
      </footer>
    </div>
  );
}

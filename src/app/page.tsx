import { Header } from "@/components/header";
import { CatalogSearch } from "@/components/catalog-search";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-blue-100 via-white to-blue-300">
      <Header />
      <main className="flex flex-1 flex-col items-center px-2 py-4 sm:px-4">
        <div className="w-full max-w-lg sm:max-w-2xl mx-auto modern-card bg-white/90 p-6 sm:p-8 animate-fade-in">
          <CatalogSearch />
        </div>
        <footer className="w-full text-center text-xs text-gray-500 mt-10 mb-2 animate-fade-in">
          <span>
            © {new Date().getFullYear()} Catálogo de Productos. Todos los
            derechos reservados.
          </span>
        </footer>
      </main>
    </div>
  );
}

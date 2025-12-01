import { BookOpenCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-3 text-primary">
          <BookOpenCheck className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
            Catálogo de Productos
          </h1>
        </div>
      </div>
    </header>
  );
}

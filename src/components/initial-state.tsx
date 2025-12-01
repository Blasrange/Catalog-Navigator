import { PackageSearch } from "lucide-react";

export function InitialState() {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-card p-12 text-center shadow-sm">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <PackageSearch className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-card-foreground sm:text-2xl">
        Listo para buscar en tu catálogo
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Consulta tu catálogo en línea ingresando el EAN del producto. ¡Obtén
        información actualizada y visualiza detalles al instante!
      </p>
    </div>
  );
}

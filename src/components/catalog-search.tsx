"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// Importación dinámica para evitar problemas de SSR
const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { searchProduct, type SearchResult } from "@/app/actions";
import { getProductByCode } from "@/lib/catalog-data";
import { InitialState } from "./initial-state";
import { ProductDisplaySkeleton } from "./product-display-skeleton";
import { ProductDisplay } from "./product-display";

const formSchema = z.object({
  query: z.string().min(1, {
    message: "Por favor, ingrese un término de búsqueda.",
  }),
});

export function CatalogSearch() {
  const { toast } = useToast();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  // Verificar si hay cámara disponible
  useEffect(() => {
    async function checkCamera() {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInput = devices.some((d) => d.kind === "videoinput");
          setHasCamera(videoInput);
        } catch {
          setHasCamera(false);
        }
      } else {
        setHasCamera(false);
      }
    }
    checkCamera();
  }, []);
  // Cuando se detecta un código, rellenar el input y lanzar búsqueda
  const handleScan = async (err: any, result: any) => {
    if (result?.text) {
      form.setValue("query", result.text, { shouldValidate: true });
      // Lanzar búsqueda automáticamente
      await form.handleSubmit(onSubmit)();
    }
    if (err) {
      // Puedes mostrar un toast si quieres
      // toast({ variant: "destructive", title: "Error de escaneo", description: err.message });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
    },
  });

  const { isSubmitting } = form.formState;
  const queryValue = form.watch("query");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchResult(null);
    // Buscar el producto en el catálogo local
    const localProduct = getProductByCode(values.query);
    if (!localProduct) {
      toast({
        variant: "destructive",
        title: "Producto no encontrado",
        description: "No se encontró el producto en el catálogo local.",
      });
      return;
    }
    // Obtener el productId
    const productId = localProduct.productDetails.productId;
    if (!productId) {
      toast({
        variant: "destructive",
        title: "Sin productId",
        description: "El producto no tiene productId asociado.",
      });
      return;
    }
    // Consultar el backend con el productId
    const result = await searchProduct(productId);
    setSearchResult(result);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error de Búsqueda",
        description: result.error,
      });
    }
  }

  function handleClear() {
    form.reset({ query: "" });
    setSearchResult(null);
  }

  return (
    <div className="space-y-4 bg-white/80 backdrop-blur rounded-xl shadow-lg p-3 max-w-full mx-auto animate-fade-in">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-2"
        >
          <div className="flex w-full gap-2 items-center">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="relative flex items-center">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 transition-transform duration-200 hover:scale-110" />
                    <FormControl>
                      <Input
                        placeholder="Buscar Palabra Clave"
                        className="pl-8 pr-8 h-10 text-sm rounded-full border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-inner bg-white/70 backdrop-blur placeholder:text-gray-400"
                        {...field}
                      />
                    </FormControl>
                    {!!queryValue && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/80 hover:bg-blue-50 shadow transition-all duration-200 flex items-center justify-center"
                        aria-label="Limpiar búsqueda"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-transform duration-200 hover:scale-110" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-white shadow-md hover:shadow-lg hover:scale-110 transition-transform duration-200 border-none flex items-center justify-center"
              aria-label="Buscar"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
            {/* Botón de escanear separado y funcional */}
            <div className="relative group">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowScanner(true)}
                className="h-10 w-10 rounded-full border-2 border-blue-500 bg-blue-100 text-blue-600 shadow-md hover:bg-blue-200 hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                aria-label="Escanear código"
                disabled={!hasCamera}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-7 w-7"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 12h.01M12 12h.01M15 12h.01"
                  />
                </svg>
              </Button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                Escanear
              </span>
            </div>
          </div>
        </form>
      </Form>

      {/* Modal/Overlay para el escáner */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowScanner(false)}
              aria-label="Cerrar escáner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="mb-2 text-center font-semibold">
              Escanea un código
            </div>
            {!hasCamera ? (
              <div className="w-full h-64 flex flex-col items-center justify-center text-center text-red-600">
                <div className="mb-2 font-bold">
                  No se detectó una cámara disponible.
                </div>
                <div className="text-sm text-gray-700">
                  Por favor, conecta una cámara y/o permite el acceso en la
                  configuración del navegador.
                  <br />
                  En PC, revisa los permisos de cámara y recarga la página.
                </div>
              </div>
            ) : (
              <div className="w-full h-64">
                <BarcodeScannerComponent
                  width={"100%"}
                  height={250}
                  onUpdate={handleScan}
                />
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2 text-center">
              Apunta la cámara al código de barras o QR
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        {isSubmitting ? (
          <ProductDisplaySkeleton />
        ) : searchResult?.success ? (
          <ProductDisplay data={searchResult.data} />
        ) : (
          <InitialState />
        )}
      </div>
    </div>
  );
}

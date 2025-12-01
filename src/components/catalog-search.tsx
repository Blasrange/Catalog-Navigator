"use client";

import { useState } from "react";
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
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-2"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <FormControl>
                    <Input
                      placeholder="Buscar por EAN o material..."
                      className="pl-10 pr-10 h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  {!!queryValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                      aria-label="Limpiar búsqueda"
                    >
                      <Trash2 className="h-5 w-5 text-destructive/70 hover:text-destructive transition-colors" />
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
            className="h-12 w-12 shrink-0 sm:w-auto sm:px-6"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Buscar</span>
              </>
            )}
          </Button>
        </form>
      </Form>

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

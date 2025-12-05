import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import type { Product } from "@/lib/catalog-data";
import { getProductByCode } from "@/lib/catalog-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductDisplay({ data }: { data: Product }) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Buscar producto dentro del catálogo
  const catalogProduct =
    getProductByCode(data.productName) ||
    getProductByCode(data.productDetails?.SKU) ||
    getProductByCode(data.productDetails?.productId);

  // Usar información del catálogo si existe
  const mergedData = catalogProduct ?? data;

  // Mejorar: permitir hasta 2 imágenes si existen en el producto
  const images: string[] = [];
  if (mergedData.imageUrl) images.push(mergedData.imageUrl);
  if (
    typeof mergedData.imageUrl2 === "string" &&
    mergedData.imageUrl2.length > 10
  ) {
    images.push(mergedData.imageUrl2);
  }

  const hasDetails =
    mergedData.productDetails &&
    Object.keys(mergedData.productDetails).length > 0;

  const salsifyCatalogId = "0ba92b3f-b927-4418-8de9-e177b867bb3e";
  const productId = mergedData.productDetails.productId;
  const salsifyUrl = productId
    ? `https://app.salsify.com/catalogs/${salsifyCatalogId}/products/${productId}`
    : undefined;

  const formatKey = (key: string) => {
    if (key.toUpperCase() === "EAN") return "EAN";
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <Card className="overflow-hidden shadow-2xl transition-shadow hover:shadow-blue-300 w-full border-2 border-blue-100 bg-gradient-to-br from-white via-blue-50 to-white">
        <CardHeader className="flex flex-row justify-between items-start bg-blue-50/60">
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-blue-700 md:text-3xl">
              {mergedData.productName}
            </CardTitle>

            {mergedData.nombreComercial && (
              <div className="text-base text-blue-500 font-semibold mt-1">
                {mergedData.nombreComercial}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 md:grid-cols-5 p-8">
          <div className="md:col-span-2 flex flex-col gap-4 items-center">
            <div className="flex flex-col gap-4 w-full items-center">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative aspect-square w-40 h-40 overflow-hidden rounded-xl border-2 border-blue-200 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200",
                    selectedImage === img && "ring-4 ring-blue-400"
                  )}
                  onClick={() => {
                    setOpen(true);
                    setSelectedImage(img);
                  }}
                >
                  <Image
                    src={img.replace(/h_\d{2,3},w_\d{2,3}/, "h_800,w_800")}
                    alt={mergedData.productName + " " + idx}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-blue-400 mt-2">
              Haz clic en la imagen para ampliar
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-blue-700">Descripción</h3>
              <p className="text-gray-700 text-base">
                {mergedData.productDescription}
              </p>
            </div>

            {hasDetails && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-blue-700">
                    Detalles del Producto
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(mergedData.productDetails).map(
                      ([key, value]) =>
                        key !== "imageUrl2" &&
                        key.toLowerCase() !== "productid" && (
                          <div
                            key={key}
                            className="rounded-lg border bg-background p-4 flex flex-col shadow-sm"
                          >
                            <span className="text-base font-semibold text-blue-600 mb-1">
                              {formatKey(key)}
                            </span>
                            <p className="text-gray-600 text-sm">
                              {typeof value === "string" && value.length > 200
                                ? value.slice(0, 500) + "..."
                                : value}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl p-0 flex flex-col items-center justify-center bg-white rounded-xl overflow-auto max-h-[90vh]">
          {selectedImage && (
            <div className="w-full flex items-center justify-center p-2">
              <Image
                src={selectedImage.replace(
                  /h_\d{2,3},w_\d{2,3}/,
                  "h_1200,w_1200"
                )}
                alt={mergedData.productName}
                width={600}
                height={600}
                className="object-contain w-full h-auto max-h-[70vh] rounded-lg"
                priority
              />
            </div>
          )}

          {productId && salsifyUrl && (
            <Button asChild variant="outline" size="sm" className="mt-4 mb-4">
              <Link href={salsifyUrl} target="_blank">
                Ver en Salsify
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

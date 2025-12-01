import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import type { Product } from "@/lib/catalog-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function ProductDisplay({ data }: { data: Product }) {
  const [open, setOpen] = useState(false);
  const hasDetails =
    data.productDetails && Object.keys(data.productDetails).length > 0;
  const salsifyCatalogId = "0ba92b3f-b927-4418-8de9-e177b867bb3e";
  const productId = data.productDetails.productId;
  const salsifyUrl = productId
    ? `https://app.salsify.com/catalogs/${salsifyCatalogId}/products/${productId}`
    : undefined;

  // Function to format the key
  const formatKey = (key: string) => {
    if (key.toUpperCase() === "EAN") {
      return "EAN";
    }
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <>
      <Card className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl w-full">
        <CardHeader className="flex flex-row justify-between items-start bg-muted/30">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight md:text-2xl">
              {data.productName}
            </CardTitle>
            {data.nombreComercial && (
              <div className="text-base text-primary font-medium mt-1">
                {data.nombreComercial}
              </div>
            )}
          </div>
          {productId && salsifyUrl && (
            <Button asChild variant="outline" size="sm">
              <Link href={salsifyUrl} target="_blank">
                Ver en Salsify
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-5 p-6">
          <div className="md:col-span-2">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-lg border cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Image
                src={
                  data.imageUrl
                    ? data.imageUrl.replace(
                        /h_\d{2,3},w_\d{2,3}/,
                        "h_800,w_800"
                      )
                    : `https://picsum.photos/seed/${data.productName}/800/800`
                }
                alt={data.productName}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                data-ai-hint="product photo"
              />
            </div>
          </div>
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">
                Descripción
              </h3>
              <p className="text-muted-foreground text-sm">
                {data.productDescription}
              </p>
            </div>

            {hasDetails && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-primary">
                    Detalles del Producto
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(data.productDetails).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border bg-background p-4 flex flex-col shadow-sm"
                      >
                        <span className="text-base font-semibold text-primary mb-1">
                          {formatKey(key)}
                        </span>
                        <p className="text-muted-foreground text-sm">
                          {typeof value === "string" && value.length > 200
                            ? value.slice(0, 200) + "..."
                            : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="sr-only" id="product-image-title">
              Imagen ampliada del producto
            </h2>
            <Image
              src={
                data.imageUrl
                  ? data.imageUrl.replace(
                      /h_\d{2,3},w_\d{2,3}/,
                      "h_1200,w_1200"
                    )
                  : `https://picsum.photos/seed/${data.productName}/1200/1200`
              }
              alt={data.productName}
              width={1200}
              height={1200}
              className="object-contain w-full h-full rounded-lg"
              aria-describedby="product-image-desc"
            />
            <span className="sr-only" id="product-image-desc">
              Imagen ampliada de {data.productName}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

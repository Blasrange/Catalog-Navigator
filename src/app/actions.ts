"use server";

import { exec } from "child_process";

export interface Product {
  productName: string;
  productDescription: string;
  imageUrl: string;
  productDetails: Record<string, string>;
  nombreComercial: string;
}

export type SearchResult =
  | { success: true; data: Product }
  | { success: false; error: string };

// Ejecuta el RPA con Playwright para buscar el producto en Salsify
export async function searchProduct(productId: string): Promise<SearchResult> {
  if (!productId) {
    return {
      success: false,
      error: "Debes ingresar el productId para buscar.",
    };
  }

  return new Promise((resolve) => {
    exec(`node ./rpa-salsify.js ${productId}`, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: "Error al ejecutar el RPA." });
        return;
      }
      try {
        const data = JSON.parse(stdout);
        const result: Product = {
          nombreComercial: data.nombreComercial || "",
          productName: data.nombre || productId || "Producto sin nombre",
          productDescription:
            data.descripcion || "Información extraída de Salsify",
          imageUrl: data.imagen || "",
          productDetails: {
            ...(data.featureBenefit
              ? { Feature_Benefit: data.featureBenefit }
              : {}),
          },
        };
        resolve({ success: true, data: result });
      } catch (e) {
        resolve({
          success: false,
          error: "No se pudo parsear la respuesta del RPA.",
        });
      }
    });
  });
}

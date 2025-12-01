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

  try {
    const res = await fetch(
      `https://rpa-api-7j8o.onrender.com/api/rpa-salsify?productId=${productId}`
    );
    if (!res.ok) {
      return { success: false, error: "Error al consultar la API externa." };
    }
    const data = await res.json();
    const result: Product = {
      nombreComercial: data.nombreComercial || "",
      productName: data.nombre || productId || "Producto sin nombre",
      productDescription: data.descripcion || "Información extraída de Salsify",
      imageUrl: data.imagen || "",
      productDetails: {
        ...(data.featureBenefit
          ? { Feature_Benefit: data.featureBenefit }
          : {}),
      },
    };
    return { success: true, data: result };
  } catch (e) {
    return {
      success: false,
      error: "No se pudo obtener la respuesta de la API externa.",
    };
  }
}

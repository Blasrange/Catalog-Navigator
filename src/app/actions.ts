"use server";

import { exec } from "child_process";

export interface Product {
  productName: string;
  productDescription: string;
  imageUrl: string;
  nombreComercial: string;
  productDetails: Record<string, string>;
  allImages?: string[];
}

export type SearchResult =
  | { success: true; data: Product }
  | { success: false; error: string };

// 🧹 Limpia stdout para extraer SOLO el JSON válido
function extractJson(stdout: string): string {
  const first = stdout.indexOf("{");
  const last = stdout.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error("No se encontró un objeto JSON válido en stdout");
  }

  return stdout.substring(first, last + 1);
}

export async function searchProduct(productId: string): Promise<SearchResult> {
  if (!productId) {
    return {
      success: false,
      error: "Debes ingresar el productId para buscar.",
    };
  }

  // Usar variable de entorno para la base de la API
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9002";
  try {
    const res = await fetch(
      `${apiBaseUrl}/api/product?code=${encodeURIComponent(productId)}`
    );
    if (res.ok) {
      const data = await res.json();
      // Adaptar la respuesta al tipo Product si es necesario
      return { success: true, data };
    } else {
      // Si el backend responde con error, intentar scraping directo como fallback
      // (Solo si el backend no pudo encontrar el producto)
      return await new Promise((resolve) => {
        exec(`node ./rpa-salsify.js ${productId}`, (error, stdout) => {
          if (error) {
            resolve({
              success: false,
              error: "Error al ejecutar el RPA.",
            });
            return;
          }

          try {
            // Extraer y parsear JSON
            const cleaned = extractJson(stdout);
            const data = JSON.parse(cleaned);

            // Seleccionar la mejor imagen disponible
            const imageUrl =
              data.imagenPrincipal ||
              data.imagenHD ||
              data.imagenMiniatura ||
              (data.todasLasImagenes?.length > 0
                ? data.todasLasImagenes[0]
                : "") ||
              "";

            const result: Product = {
              nombreComercial: data.nombreComercial || "",
              productName: data.nombre || productId,
              productDescription: data.descripcion || "",
              imageUrl,
              productDetails: {
                ...(data.featureBenefit
                  ? { Feature_Benefit: data.featureBenefit }
                  : {}),
              },
              allImages: data.todasLasImagenes || [],
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
  } catch (err) {
    // Si hay error de red o fetch, fallback al scraping directo
    return await new Promise((resolve) => {
      exec(`node ./rpa-salsify.js ${productId}`, (error, stdout) => {
        if (error) {
          resolve({
            success: false,
            error: "Error al ejecutar el RPA.",
          });
          return;
        }

        try {
          // Extraer y parsear JSON
          const cleaned = extractJson(stdout);
          const data = JSON.parse(cleaned);

          // Seleccionar la mejor imagen disponible
          const imageUrl =
            data.imagenPrincipal ||
            data.imagenHD ||
            data.imagenMiniatura ||
            (data.todasLasImagenes?.length > 0
              ? data.todasLasImagenes[0]
              : "") ||
            "";

          const result: Product = {
            nombreComercial: data.nombreComercial || "",
            productName: data.nombre || productId,
            productDescription: data.descripcion || "",
            imageUrl,
            productDetails: {
              ...(data.featureBenefit
                ? { Feature_Benefit: data.featureBenefit }
                : {}),
            },
            allImages: data.todasLasImagenes || [],
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
}

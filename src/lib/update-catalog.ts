import fs from "fs";
import path from "path";
import { Product } from "./catalog-data";

const catalogPath = path.resolve(__dirname, "./catalog-data.ts");

/**
 * Actualiza el catálogo en memoria y lo guarda en disco.
 * @param code EAN, SKU o productId del producto
 * @param newProduct Producto actualizado
 */
export function updateCatalogAndSave(code: string, newProduct: Product) {
  // Cargar el catálogo actual
  let catalogModule = require("./catalog-data");
  let catalog = catalogModule.catalog;

  // Actualizar en memoria
  catalog[code] = newProduct;

  // Generar el contenido del archivo manteniendo el formato
  const header = `export interface Product {
  productName: string;
  productDescription: string;
  imageUrl: string;
  productDetails: Record<string, string>;
  nombreComercial: string;
}

// Este catálogo fue generado automáticamente a partir de manifest.csv
// Puedes agregar más detalles si tienes otros archivos en el futuro
const catalog: Record<string, Product> = `;

  // Serializar el catálogo como JSON, asegurando que las claves sean strings
  const catalogString = JSON.stringify(catalog, null, 2);

  const fileContent = `${header}${catalogString};

export { catalog };
`;

  // Guardar el archivo
  fs.writeFileSync(catalogPath, fileContent, "utf8");
}

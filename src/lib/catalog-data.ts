export interface Product {
  productName: string;
  productDescription: string;
  imageUrl: string;
  productDetails: Record<string, string>;
  nombreComercial: string;
}

// Este catálogo fue generado automáticamente a partir de manifest.csv
// Puedes agregar más detalles si tienes otros archivos en el futuro
const catalog: Record<string, Product> = {
  "7702521104191": {
    productName: "7702521104191",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "156340",
      productId: "188178",
    },
  },
  "7702521100605": {
    productName: "7702521100605",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "15634",
      productId: "330715",
    },
  },
  "7702521104788": {
    productName: "7702521104788",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "7702521104788",
      productId: "188180",
    },
  },
  "7702521104849": {
    productName: "7702521104849",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "7702521104849",
      productId: "188181",
    },
  },
  "7702521104801": {
    productName: "7702521104801",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "7702521104801",
      productId: "188182",
    },
  },
  // ...agrega más productos siguiendo el mismo formato
};

/**
 * Busca un producto en el catálogo por SKU, EAN o productId.
 * @param code El SKU, EAN o productId del producto a buscar.
 * @returns El producto si se encuentra, o undefined si no.
 */
export function getProductByCode(code: string): Product | undefined {
  // Buscar por clave directa (EAN)
  if (catalog[code]) return catalog[code];
  // Buscar por SKU o productId en los detalles
  for (const prod of Object.values(catalog)) {
    if (
      prod.productDetails.SKU === code ||
      prod.productDetails.productId === code
    ) {
      return prod;
    }
  }
  return undefined;
}

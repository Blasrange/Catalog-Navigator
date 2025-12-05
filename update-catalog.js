// update-catalog.js
// Script para actualizar catalog-data.ts en lote usando rpa-salsify.js

// update-catalog.js
// Actualiza catalog-data.ts con datos de scraping y SKUs originales desde un CSV

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
let csvParse;
try {
  csvParse = require("csv-parse/sync");
} catch {
  console.error(
    "Falta el paquete csv-parse. Instálalo con: npm install csv-parse"
  );
  process.exit(1);
}

// Ruta al archivo de catálogo
const catalogPath = path.join(__dirname, "src", "lib", "catalog-data.ts");
// Ruta al archivo CSV de SKUs (debe tener columnas: productId,SKU)
const skuExcelPath = path.join(__dirname, "productos.xlsx");

let xlsx;
try {
  xlsx = require("xlsx");
} catch {
  console.error("Falta el paquete xlsx. Instálalo con: npm install xlsx");
  process.exit(1);
}

// Leer y parsear los SKUs desde productos.xlsx
let skuMap = {};
if (fs.existsSync(skuExcelPath)) {
  const workbook = xlsx.readFile(skuExcelPath);
  const sheetName = workbook.SheetNames[0];
  const records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
  });
  for (const row of records) {
    const productId = String(row.productId || "").trim();
    const sku = String(row.sku || "").trim();
    if (productId && sku) {
      skuMap[productId] = sku;
    }
  }
  console.log(
    `[LOG] SKUs originales cargados desde productos.xlsx (${records.length} registros)`
  );
} else {
  console.warn(
    "[WARN] No se encontró productos.xlsx, solo se actualizarán datos de scraping."
  );
}

// Cargar el archivo como texto
let catalogText = fs.readFileSync(catalogPath, "utf8");

// Extraer el objeto catalog como JSON (parsing manual, no eval)
const catalogStart = catalogText.indexOf("const catalog:");
const catalogObjStart = catalogText.indexOf("{", catalogStart);
const catalogObjEnd = catalogText.indexOf("};", catalogObjStart) + 1;
const catalogJsonText = catalogText.substring(catalogObjStart, catalogObjEnd);

// Usar Function para parsear el objeto TypeScript a JS
let catalog;
try {
  catalog = Function("return " + catalogJsonText)();
} catch (e) {
  console.error("No se pudo parsear el catálogo:", e);
  process.exit(1);
}

// Leer parámetro --code o --productId
const argCode =
  process.argv.find((arg) => arg.startsWith("--code=")) ||
  process.argv.find((arg) => arg.startsWith("--productId="));
let singleProductId = null;
if (argCode) {
  singleProductId = argCode.split("=")[1];
}

let productIds;
if (singleProductId) {
  productIds = [singleProductId];
  console.log(`[LOG] Actualizando solo el producto ${singleProductId}`);
} else {
  // Obtener todos los productId únicos del catálogo
  productIds = Object.values(catalog)
    .map((prod) => prod.productDetails.productId)
    .filter(Boolean);
  console.log(
    `[LOG] Actualizando catálogo completo (${productIds.length} productos)`
  );
}

// Procesar cada productId
for (const productId of productIds) {
  console.log(`Procesando producto ${productId}...`);
  const result = spawnSync("node", ["rpa-salsify.js", productId], {
    encoding: "utf8",
  });
  if (result.error) {
    console.error(
      `Error ejecutando rpa-salsify.js para ${productId}:`,
      result.error
    );
    continue;
  }
  let data;
  try {
    data = JSON.parse(result.stdout.split("\n").pop());
  } catch (e) {
    console.error(`No se pudo parsear la salida para ${productId}:`, e);
    continue;
  }
  // Buscar el producto en el catálogo por productId
  const prodKey = Object.keys(catalog).find(
    (key) => catalog[key].productDetails.productId === productId
  );
  if (!prodKey) continue;
  // Actualizar los campos del scraping
  catalog[prodKey].productName = data.nombre || "";
  catalog[prodKey].productDescription = data.descripcion || "";
  catalog[prodKey].imageUrl = data.imagenPrincipal || "";
  catalog[prodKey].imageUrl2 =
    Array.isArray(data.todasLasImagenes) && data.todasLasImagenes.length > 1
      ? data.todasLasImagenes[1]
      : "";
  catalog[prodKey].nombreComercial = data.nombreComercial || "";
  // Si hay SKU original en el CSV, actualizarlo
  if (skuMap[productId]) {
    catalog[prodKey].productDetails.SKU = skuMap[productId];
  }
}

// Reconstruir el archivo catalog-data.ts asegurando que todas las claves sean strings
const beforeCatalog = catalogText.substring(0, catalogObjStart);
const afterCatalog = catalogText.substring(catalogObjEnd);
// Usar JSON.stringify y NO quitar las comillas de las claves
const newCatalogText =
  beforeCatalog + JSON.stringify(catalog, null, 2) + afterCatalog;

fs.writeFileSync(catalogPath, newCatalogText, "utf8");
console.log("Catálogo actualizado correctamente.");

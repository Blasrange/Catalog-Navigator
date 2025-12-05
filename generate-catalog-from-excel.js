// Script para generar un nuevo archivo catalog-data.ts desde productos.xlsx y guardarlo en catalog-backup
// Uso: node generate-catalog-from-excel.js

const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const excelPath = path.join(__dirname, "productos.xlsx");
const backupDir = path.join(__dirname, "catalog-backup");

if (!fs.existsSync(excelPath)) {
  console.error("No se encontró el archivo productos.xlsx");
  process.exit(1);
}

const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
  defval: "",
});

// Construir el objeto catalog
let catalogEntries = "";
for (const row of records) {
  const ean = String(row.ean ?? "").trim();
  const sku = String(row.sku ?? "").trim();
  const productId = String(row.productId ?? "").trim();
  if (!ean || !sku || !productId) continue;
  catalogEntries += `  "${ean}": {
    productName: "${ean}",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "${sku}",
      productId: "${productId}"
    },
    imageUrl2: ""
  },\n`;
}

const catalogText = `export interface Product {
  productName: string;
  productDescription: string;
  imageUrl: string;
  imageUrl2?: string;
  productDetails: Record<string, string>;
  nombreComercial: string;
}

const catalog: Record<string, Product> = {
${catalogEntries}};
`;

// Crear carpeta si no existe
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

const now = new Date();
const dateStr = now.toISOString().slice(0, 10);
const backupFile = path.join(backupDir, `catalog-data-${dateStr}.ts`);
fs.writeFileSync(backupFile, catalogText, "utf8");
console.log(`Archivo generado: ${backupFile}`);

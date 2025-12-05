// rpa-salsify.js
const { chromium } = require("playwright");

async function buscarProducto(productId) {
  const SALSIFY_URL =
    "https://app.salsify.com/catalogs/0ba92b3f-b927-4418-8de9-e177b867bb3e/products";

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`${SALSIFY_URL}/${productId}`, { waitUntil: "networkidle" });

  // -----------------------------------------
  // 🏷 Nombre comercial
  // -----------------------------------------
  let nombreComercial = "";
  try {
    nombreComercial = await page.$eval(
      'div[data-test-property="Labelling_Product_Name"] .product-property-value span',
      (el) => el.textContent.trim()
    );
  } catch {}

  // -----------------------------------------
  // 🏷 Nombre principal
  // -----------------------------------------
  let nombre = "";
  try {
    nombre = await page.$eval("a.active.ember-view", (el) =>
      el.textContent.trim()
    );
  } catch {}

  // -----------------------------------------
  // 🖼 Imagen principal (inteligente + robusto)
  // -----------------------------------------

  let imagenHD = "";
  try {
    imagenHD = await page.$eval(
      ".product-profile-image .mfp-image a",
      (el) => el.href
    );
  } catch {}

  let imagenMiniatura = "";
  try {
    imagenMiniatura = await page.$eval(
      ".product-profile-image .mfp-image img",
      (el) => el.src
    );
  } catch {}

  // Fallback #3: Imágenes en Back_Image y Other_Images
  let imagenAsset = "";
  try {
    imagenAsset = await page.$eval(
      ".product-asset-value--image-wrapper img",
      (el) => el.src
    );
  } catch {}

  // Fallback #4: Cualquier imagen del DOM
  let imagenGlobal = "";
  try {
    const allImgs = await page.$$eval("img", (imgs) =>
      imgs.map((i) => i.src).filter(Boolean)
    );
    imagenGlobal = allImgs[0] || "";
  } catch {}

  // Seleccionar la mejor imagen disponible
  const imagenPrincipal =
    imagenHD || imagenMiniatura || imagenAsset || imagenGlobal || "";

  // -----------------------------------------
  // 📝 Descripción
  // -----------------------------------------
  let descripcion = "";
  try {
    descripcion = await page.$eval(
      'div[data-test-property="Brand_Marketing_Description"] .product-property-value span',
      (el) => el.textContent.trim()
    );
  } catch {}

  // -----------------------------------------
  // ⭐ Beneficio principal
  // -----------------------------------------
  let featureBenefit = "";
  try {
    featureBenefit = await page.$eval(
      'div[data-test-property="Feature_Benefit"] .product-property-value span',
      (el) => el.textContent.trim()
    );
  } catch {}

  // -----------------------------------------
  // 🖼 Todas las imágenes disponibles
  // -----------------------------------------
  let todasLasImagenes = [];
  try {
    todasLasImagenes = await page.$$eval("img", (imgs) =>
      Array.from(new Set(imgs.map((i) => i.src))).filter(Boolean)
    );
  } catch {}

  await browser.close();

  return {
    nombreComercial,
    nombre,
    descripcion,
    featureBenefit,
    imagenMiniatura,
    imagenHD,
    imagenPrincipal,
    todasLasImagenes,
    imageUrl2:
      Array.isArray(todasLasImagenes) && todasLasImagenes.length > 1
        ? todasLasImagenes[1]
        : "",
  };
}

// Ejecutado directamente desde terminal
if (require.main === module) {
  const productId = process.argv[2];
  buscarProducto(productId).then((data) => {
    process.stdout.write(JSON.stringify(data));
  });
}

module.exports = { buscarProducto };

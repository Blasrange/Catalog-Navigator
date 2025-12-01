const { chromium } = require("playwright");

const SALSIFY_URL =
  "https://app.salsify.com/catalogs/0ba92b3f-b927-4418-8de9-e177b867bb3e/products";

async function buscarProducto(productId) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Ir directamente al producto (sin login)
  await page.goto(`${SALSIFY_URL}/${productId}`);
  await page.waitForLoadState("networkidle");

  // Extraer nombre comercial del producto desde Labelling_Product_Name
  let nombreComercial = "";
  try {
    nombreComercial = await page.$eval(
      'div[data-test-property="Labelling_Product_Name"] .product-property-value span._value-text_xztep4',
      (el) => el.textContent.trim()
    );
  } catch (e) {
    nombreComercial = "";
  }

  // Nombre del producto
  let nombre = "";
  try {
    await page.waitForSelector("a.active.ember-view", { timeout: 5000 });
    nombre = await page.$eval("a.active.ember-view", (el) =>
      el.textContent.trim()
    );
  } catch (e) {
    nombre = "";
  }

  // Imagen del producto
  let imagen = "";
  try {
    await page.waitForSelector("#ember65.mfp-image img", { timeout: 5000 });
    imagen = await page.$eval("#ember65.mfp-image img", (el) => el.src);
  } catch (e) {
    imagen = "";
  }

  // Descripción
  let descripcion = "";
  try {
    descripcion = await page.$eval(
      'div[data-test-property="Brand_Marketing_Description"] .product-property-value span',
      (el) => el.textContent.trim()
    );
  } catch (e) {
    descripcion = "";
  }

  // Beneficio principal (Feature_Benefit)
  let featureBenefit = "";
  try {
    featureBenefit = await page.$eval(
      'div[data-test-property="Feature_Benefit"] .product-property-value span',
      (el) => el.textContent.trim()
    );
  } catch (e) {
    featureBenefit = "";
  }

  await browser.close();
  return {
    nombreComercial,
    nombre,
    imagen,
    descripcion,
    featureBenefit,
  };
}

// Ejemplo de uso desde terminal
if (require.main === module) {
  const productId = process.argv[2];
  if (!productId) {
    console.error("Debes pasar el productId como argumento");
    process.exit(1);
  }
  buscarProducto(productId).then((data) => {
    console.log(JSON.stringify(data, null, 2));
  });
}

module.exports = { buscarProducto };

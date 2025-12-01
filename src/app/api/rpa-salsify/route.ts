import { NextRequest } from "next/server";
import { chromium } from "playwright";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return new Response(JSON.stringify({ error: "Falta productId" }), {
      status: 400,
    });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(
      `https://app.salsify.com/catalogs/0ba92b3f-b927-4418-8de9-e177b867bb3e/products/${productId}`
    );
    await page.waitForLoadState("networkidle");

    let nombreComercial = "";
    try {
      nombreComercial = await page.$eval(
        'div[data-test-property="Labelling_Product_Name"] .product-property-value span._value-text_xztep4',
        (el) => el.textContent.trim()
      );
    } catch {
      nombreComercial = "";
    }

    let nombre = "";
    try {
      await page.waitForSelector("a.active.ember-view", { timeout: 5000 });
      nombre = await page.$eval("a.active.ember-view", (el) =>
        el.textContent.trim()
      );
    } catch {
      nombre = "";
    }

    let imagen = "";
    try {
      await page.waitForSelector("#ember65.mfp-image img", { timeout: 5000 });
      imagen = await page.$eval("#ember65.mfp-image img", (el) => (el as HTMLImageElement).src);
    } catch {
      imagen = "";
    }

    let descripcion = "";
    try {
      descripcion = await page.$eval(
        'div[data-test-property="Brand_Marketing_Description"] .product-property-value span',
        (el) => el.textContent.trim()
      );
    } catch {
      descripcion = "";
    }

    let featureBenefit = "";
    try {
      featureBenefit = await page.$eval(
        'div[data-test-property="Feature_Benefit"] .product-property-value span',
        (el) => el.textContent.trim()
      );
    } catch {
      featureBenefit = "";
    }

    await browser.close();
    return new Response(
      JSON.stringify({
        nombreComercial,
        nombre,
        imagen,
        descripcion,
        featureBenefit,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Error al ejecutar Playwright" }),
      { status: 500 }
    );
  }
}

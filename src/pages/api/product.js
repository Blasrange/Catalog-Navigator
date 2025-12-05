import { exec } from "child_process";

export default function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Falta el parámetro code" });

  // Importar dinámicamente para evitar caché
  const { getProductByCode } = require("../../lib/catalog-data");
  let product = getProductByCode(code);
  const isEmptyProduct =
    product &&
    !product.productDescription &&
    !product.imageUrl &&
    !product.nombreComercial;
  if (product && !isEmptyProduct) {
    return res.status(200).json(product);
  }

  // Ejecuta el update-catalog.js para el producto faltante
  exec(
    `node update-catalog.js --code ${code}`,
    async (error, stdout, stderr) => {
      if (error) {
        res
          .status(500)
          .json({ error: "Error actualizando catálogo", details: stderr });
        return;
      }
      // Vuelve a consultar el catálogo después de actualizar
      delete require.cache[require.resolve("../../lib/catalog-data")];
      const {
        getProductByCode: getUpdatedProductByCode,
        catalog,
      } = require("../../lib/catalog-data");
      const updatedProduct = getUpdatedProductByCode(code);
      // Persistir el catálogo actualizado
      try {
        const { updateCatalogAndSave } = require("../../lib/update-catalog");
        updateCatalogAndSave(code, updatedProduct);
      } catch (err) {
        // No log, solo error en respuesta si falla
        res
          .status(500)
          .json({
            error: "Error al guardar el catálogo",
            details: err?.message || err,
          });
        return;
      }
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res
          .status(404)
          .json({ error: "Producto no encontrado tras actualización" });
      }
    }
  );
}

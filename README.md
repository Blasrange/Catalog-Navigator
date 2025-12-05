# Catálogo de Productos

## Descripción General

**Catalog Navigator** es una aplicación web moderna construida con Next.js y TypeScript. Su propósito principal es permitir a los usuarios buscar productos dentro de un catálogo de productos utilizando su código EAN (European Article Number) o cualquier otro identificador único.

Esta herramienta está diseñada para ser una interfaz rápida y eficiente para consultar información de productos que se gestionan externamente, por ejemplo, en una plataforma PIM (Product Information Management) como Salsify. La aplicación utiliza un catálogo de datos local para realizar búsquedas instantáneas y presenta la información de manera clara y profesional, incluyendo un enlace directo al producto en la plataforma de origen.

## Características Principales

- **Búsqueda Rápida**: Búsqueda de productos por EAN o código de material.
- **Visualización de Detalles**: Muestra el nombre, descripción, imagen y detalles técnicos del producto.
- **Diseño Moderno**: Interfaz de usuario limpia, moderna y responsiva.
- **Enlace a Origen**: Proporciona un enlace directo a la página del producto en Salsify para una consulta más detallada.
- **Fácilmente Extensible**: El catálogo de productos se gestiona en un único archivo, facilitando la adición de nuevos productos.
- **Botón de Limpieza**: Incluye una funcionalidad para limpiar fácilmente la búsqueda actual y empezar de nuevo.

## Estructura del Proyecto y Archivos Clave

Aquí se describen los archivos y directorios más importantes de la aplicación:

- **`src/app/page.tsx`**: Es la página principal y el punto de entrada de la interfaz de usuario. Contiene el componente de búsqueda.

- **`src/app/layout.tsx`**: Es el diseño raíz de la aplicación. Aquí se definen elementos comunes como la estructura del HTML, fuentes y el `Toaster` para notificaciones.

- **`src/lib/catalog-data.ts`**: **Este es el archivo más importante que deberás editar.** Contiene el objeto `catalog` que actúa como la base de datos de productos de la aplicación. Para añadir tus productos, debes exportar los datos de Salsify (u otra fuente) y formatearlos según la estructura definida en este archivo.

- **`src/components/catalog-search.tsx`**: Este componente de React contiene toda la lógica de la interfaz de búsqueda, incluyendo el formulario, el manejo del estado de carga y la visualización de los resultados o del estado inicial.

- **`src/components/product-display.tsx`**: Componente encargado de renderizar la tarjeta con toda la información de un producto cuando se encuentra una coincidencia.

- **`src/components/header.tsx`**: Define la barra de navegación superior de la aplicación.

- **`src/app/actions.ts`**: Contiene la `searchProduct`, una "Server Action" de Next.js que ejecuta la lógica de búsqueda en el servidor, consultando el archivo `catalog-data.ts`.

- **`src/app/globals.css`**: Archivo para los estilos globales y la configuración de las variables de color del tema de la aplicación.

- **`package.json`**: Define los scripts del proyecto (para iniciar, construir, etc.) y lista todas las dependencias y librerías utilizadas.

- **`next.config.ts`**: Archivo de configuración de Next.js. Aquí se configuran aspectos como los dominios de imágenes permitidos.

## Cómo Ejecutar la Aplicación

Para poner en marcha la aplicación en un entorno de desarrollo, sigue estos pasos:

1.  **Instalar Dependencias**: Abre una terminal en el directorio raíz del proyecto y ejecuta el siguiente comando para instalar todas las librerías necesarias:

    ```bash
    npm install
    ```

2.  **Iniciar el Servidor de Desarrollo**: Una vez instaladas las dependencias, inicia la aplicación con el siguiente comando:

    ```bash
    npm run dev
    ```

3.  **Abrir en el Navegador**: La aplicación estará disponible en la dirección que aparezca en la terminal, generalmente `http://localhost:9002`.

## Cómo Añadir Productos al Catálogo

Para que la aplicación muestre tus productos, sigue estos pasos:

1.  Abre el archivo `src/lib/catalog-data.ts`.
2.  Dentro del objeto `catalog`, añade una nueva entrada para cada producto. La `clave` debe ser el EAN del producto como un string.
3.  El `valor` debe ser un objeto con la estructura definida por la interfaz `Product`, incluyendo `productName`, `productDescription`, `imageUrl` y un objeto `productDetails` con todos los atributos que quieras mostrar.

### Ejemplo de un producto:

```typescript
"7702521104191": {
  productName: "Dog Chow Adultos Medianos y Grandes",
  productDescription: "Alimento completo para perros adultos...",
  imageUrl: "https://image.salsify.com/image/upload/s--s7LebIsy--/c_limit,cs_srgb,h_275,w_275/qr6bd01mtslemdvqukus.jpg",
  productDetails: {
    "EAN": "7702521104191",
    "ID de Producto": "511526",
    "Marca": "Dog Chow"
  }
}
```

<!-- Listo! Ahora el script update-catalog.js:

Actualiza la información de cada producto usando el scraping.
Si encuentra un archivo skus.csv (con columnas productId,SKU), también actualiza el campo SKU con el valor original del Excel.
Solo necesitas:

Guardar tu Excel como skus.csv en la raíz del proyecto (junto a update-catalog.js).
Ejecutar: node update-catalog.js
Así tendrás el catálogo actualizado tanto con los datos de Salsify como con los SKUs originales de tu Excel. ¿Necesitas el formato exacto del CSV o alguna otra ayuda? -->

<!-- npm install csv-parse
node update-catalog.js -->


<!-- Listo! El script ahora lee directamente el archivo productos.xlsx (Excel) en la raíz del proyecto.

Solo coloca tu archivo productos.xlsx con las columnas ean, sku, productId.
Ejecuta el script con: npm install xlsx
node add-skus-to-catalog.js -->
export interface Product {
  productName: string;
  productDescription: string;
  imageUrl: string;
  imageUrl2?: string;
  productDetails: Record<string, string>;
  nombreComercial: string;
}

const catalog: Record<string, Product> = {
  "7702521106331": {
    productName: "7702521106331",
    productDescription: "",
    imageUrl: "",
    nombreComercial: "",
    productDetails: {
      SKU: "7702521106331",
      productId: "1000003"
    },
    imageUrl2: ""
  },
};

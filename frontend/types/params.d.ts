interface ProductParams {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  variants: {
    sku: string;
    stockLevel?: number;
    attributes: {
      color?: string;
      size?: string;
    };
  }[];
}

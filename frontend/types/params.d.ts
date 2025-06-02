interface ProductParams {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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

interface ShoppingCartParams {
  userId: string;
  items: {
    productId: string;
    productVariant: {
      productSku: string;
      quantity: number;
    };
  }[];
}

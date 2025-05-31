export interface ItemCart {
  productId: string;
  productVariant: {
    productSku: string;
    quantity: number;
    unitPrice: number;
  };
  totalPrice: number;
}

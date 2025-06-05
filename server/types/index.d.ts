export interface ItemCart {
  product: { _id: string; name: string };
  productVariant: {
    productSku: string;
    quantity: number;
    unitPrice: number;
  };
  totalPrice: number;
}

export interface AddOrUpdateCartItemParams {
  user: mongoose.Types.ObjectId | string;
  product: { _id: string; name: string; unitPrice: number; imageUrl?: string };
  productSku: string;
  quantity: number;
}

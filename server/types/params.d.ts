export interface AddOrUpdateCartItemParams {
  userId: mongoose.Types.ObjectId | string;
  productId: string;
  productSku: string;
  quantity: number;
}

import mongoose from "mongoose";
import { CustomError } from "../../../types/error";
import { Product } from "../../../database/models";

/**
 * Check if a product variant has sufficient stock
 * @param productId The product ID
 * @param productSku The product SKU
 * @param requestedQuantity The quantity requested
 * @param session Mongoose session for transaction
 * @returns The available stock level
 * @throws CustomError if product not found or insufficient stock
 */
async function checkProductStock(
  productId: string,
  productSku: string,
  requestedQuantity: number,
  session: mongoose.ClientSession
): Promise<number> {
  // Find the product with the specific variant
  const product = await Product.findOne({
    _id: productId,
    "variants.sku": productSku,
  }).session(session);

  if (!product) {
    throw new CustomError(
      `Product with ID ${productId} and SKU ${productSku} does not exist`,
      404
    );
  }

  // Find the specific variant
  const variant = product.variants.find(
    (v: { sku: string }) => v.sku === productSku
  );
  const availableStock = variant?.stockLevel;

  if (availableStock === undefined) {
    throw new CustomError("Product stock level not found", 404);
  }

  if (availableStock < requestedQuantity) {
    throw new CustomError(
      `Insufficient stock for product with SKU ${productSku}. Available stock: ${availableStock}`,
      400
    );
  }

  return availableStock;
}

/**
 * Get the current price of a product
 * @param productId The product ID
 * @param productSku The product SKU (for validation)
 * @param session Mongoose session for transaction
 * @returns The current product price
 * @throws CustomError if product not found
 */
async function getProductPrice(
  productId: string,
  productSku: string,
  session?: mongoose.ClientSession
): Promise<number> {
  // Find the product with the specific variant
  const query = Product.findOne({
    _id: productId,
    "variants.sku": productSku,
  });

  const product = session ? await query.session(session) : await query;

  if (!product) {
    throw new CustomError(
      `Product with ID ${productId} and SKU ${productSku} does not exist`,
      404
    );
  }

  return product.price;
}

export { checkProductStock, getProductPrice };

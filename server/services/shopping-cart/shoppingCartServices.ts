import mongoose from "mongoose";
import { ShoppingCart } from "../../database/models";
import {
  checkProductStock,
  getProductPrice,
} from "../../utils/helpers/products/poductHelpers";
import { CustomError } from "../../types/error";
import { ItemCart } from "../../types";
import { AddOrUpdateCartItemParams } from "../../types/params";

/**
 * Adds a new item to a user's shopping cart or updates the quantity of an existing item.
 *
 * If the user does not have a shopping cart, a new cart is created with the specified item. If the item already exists in the cart, its quantity and total price are updated, provided sufficient stock is available. If the item does not exist in the cart, it is added as a new entry. All operations are performed within a MongoDB transaction to ensure atomicity.
 *
 * @param userId - The user's unique identifier.
 * @param productId - The product's unique identifier.
 * @param productSku - The SKU of the product variant.
 * @param quantity - The quantity to add or update.
 * @returns The updated or newly created shopping cart document. If the item quantity is updated, the returned cart includes populated product details (`name` and `imageUrl`) for the affected item.
 *
 * @throws {CustomError} If there is insufficient stock for the requested product or if the cart cannot be created or updated.
 */
export async function AddOrUpdateCartItem({
  userId,
  productId,
  productSku,
  quantity,
}: AddOrUpdateCartItemParams) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingShoppingCart = await ShoppingCart.findOne({ userId }).session(
      session
    );

    // Fetch the current price from the database
    const unitPrice = await getProductPrice(productId, productSku, session);
    const totalPrice = (quantity * unitPrice).toFixed(2);

    // If no shopping cart already exists for the user, create a new one
    if (!existingShoppingCart) {
      await checkProductStock(productId, productSku, quantity, session);

      const newShoppingCart = await ShoppingCart.create(
        [
          {
            userId,
            items: [
              {
                productId,
                productVariant: {
                  productSku,
                  quantity,
                  unitPrice,
                },
                totalPrice,
              },
            ],
          },
        ],
        { session }
      );

      if (!newShoppingCart || newShoppingCart.length === 0) {
        throw new CustomError("Failed to create shopping cart", 500);
      }

      await session.commitTransaction();
      return newShoppingCart[0];
    }

    const existingProduct = existingShoppingCart.items.find(
      (item: ItemCart) =>
        item.productId.toString() &&
        item.productVariant.productSku === productSku
    );

    // If a shopping cart exist and the product exist in the current shopping cart for the user
    if (existingProduct) {
      const availableStock = await checkProductStock(
        productId,
        productSku,
        quantity,
        session
      );

      const newQuantity = existingProduct.productVariant.quantity + quantity;
      if (newQuantity > availableStock) {
        throw new CustomError(
          `Insufficient stock for product with SKU ${productSku}. Available stock: ${availableStock}`,
          400
        );
      }

      const updatedShoppingCart = await ShoppingCart.findOneAndUpdate(
        {
          userId,
          "items.productId": productId,
          "items.productVariant.productSku": productSku,
        },
        {
          $inc: {
            "items.$.productVariant.quantity": quantity,
          },
          $set: {
            "items.$.totalPrice": (newQuantity * unitPrice).toFixed(2),
          },
        },
        {
          new: true,
          session,
        }
      ).populate({
        path: "items.productId",
        select: "name imageUrl",
      });

      if (!updatedShoppingCart) {
        throw new CustomError("Failed to update shopping cart", 500);
      }

      await session.commitTransaction();
      return updatedShoppingCart;
    }

    // If a shopping cart exist but the  product does not exist in the cart, add it

    await checkProductStock(productId, productSku, quantity, session);
    const newItem = {
      productId,
      productVariant: {
        productSku,
        quantity,
        unitPrice,
      },
      totalPrice,
    };

    const updatedShoppingCart = await ShoppingCart.findOneAndUpdate(
      { userId },
      { $push: { items: newItem } },
      { new: true, session }
    );

    if (!updatedShoppingCart) {
      throw new CustomError("Failed to update shopping cart", 500);
    }

    await session.commitTransaction();
    return updatedShoppingCart;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function deleteCart(userId: mongoose.Types.ObjectId | string) {
  const shoppingCartToDelete = await ShoppingCart.deleteOne({ userId });

  if (!shoppingCartToDelete) {
    throw new CustomError("Failed to delete shopping cart", 500);
  }
  return shoppingCartToDelete;
}

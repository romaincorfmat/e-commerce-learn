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
 * If the user does not have a shopping cart, a new cart is created with the specified item. If the item already exists in the cart, its quantity and total price are updated, ensuring stock availability. If the item does not exist in the cart, it is added as a new entry. All operations are performed within a MongoDB transaction for atomicity.
 *
 * @param user - The user object or user ID.
 * @param product - The product object.
 * @param productSku - The SKU of the product variant.
 * @param quantity - The quantity to add or update.
 * @returns The updated or newly created shopping cart document. If the item quantity is updated, the returned cart includes populated product details (`name` and `imageUrl`) for the affected item.
 *
 * @throws {CustomError} If stock is insufficient, or if cart creation or update fails.
 */
export async function AddOrUpdateCartItem({
  user,
  product,
  productSku,
  quantity,
}: AddOrUpdateCartItemParams) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingShoppingCart = await ShoppingCart.findOne({
      user: user._id,
    }).session(session);

    // Fetch the current price from the database
    const unitPrice = await getProductPrice(product._id, productSku, session);
    const totalPrice = (quantity * unitPrice).toFixed(2);

    // If no shopping cart already exists for the user, create a new one
    if (!existingShoppingCart) {
      await checkProductStock(product._id, productSku, quantity, session);

      const newShoppingCart = await ShoppingCart.create(
        [
          {
            user: user._id,
            items: [
              {
                product: product._id,
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
        item.product._id.toString() === product._id.toString() &&
        item.productVariant.productSku === productSku
    );

    // If a shopping cart exist and the product exist in the current shopping cart for the user
    if (existingProduct) {
      const availableStock = await checkProductStock(
        product._id,
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
          user: user._id,
          "items.product": product._id,
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
      );

      if (!updatedShoppingCart) {
        throw new CustomError("Failed to update shopping cart", 500);
      }

      await session.commitTransaction();
      return updatedShoppingCart;
    }

    // If a shopping cart exist but the  product does not exist in the cart, add it

    await checkProductStock(product._id, productSku, quantity, session);
    const newItem = {
      product: product._id,
      productVariant: {
        productSku,
        quantity,
        unitPrice,
      },
      totalPrice,
    };

    const updatedShoppingCart = await ShoppingCart.findOneAndUpdate(
      { user: user._id },
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
  const shoppingCartToDelete = await ShoppingCart.deleteOne({ user: userId });

  if (!shoppingCartToDelete) {
    throw new CustomError("Failed to delete shopping cart", 500);
  }
  return shoppingCartToDelete;
}

import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/error";
import { ShoppingCart } from "../database/models";
import {
  AddOrUpdateCartItem,
  deleteCart,
} from "../services/shopping-cart/shoppingCartServices";
import mongoose from "mongoose";
import {
  CreateShoppingCartBodySchema,
  DeleteShoppingCartSchema,
} from "../utils/helpers/shopping-cart/validation";

/**
 * Get All Shopping Carts for the authenticated user
 * @param req Request object containing user information
 * @param res Response object
 * @param next Next function for error handling
 */
export async function getShoppingCarts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new CustomError("User not authenticated", 401);
    }

    const { _id: userId } = req.user;

    const shoppingCarts = await ShoppingCart.find({ userId });

    res.status(200).json({
      message: "Shopping cart fetched successfully",
      cart: shoppingCarts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Creates or updates a shopping cart for the authenticated user
 * Handles adding new products or updating quantities of existing products
 * Validates product availability before adding to cart
 * @param req Request object containing user and product information
 * @param res Response object
 * @param next Next function for error handling
 */

export async function createShoppingCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;

    if (!user) {
      throw new CustomError("User not authenticated", 401);
    }

    const parsed = CreateShoppingCartBodySchema.safeParse(req.body);

    if (!parsed.success) {
      throw new CustomError(
        `Invalid request body, Parse Errors: ${parsed.error.errors}`,
        400
      );
    }

    const {
      product,
      productVariant: { productSku, quantity },
    } = parsed.data.items[0];

    const newOrUpdatedCart = await AddOrUpdateCartItem({
      user: user._id as mongoose.Types.ObjectId | string,
      product,
      productSku,
      quantity,
    });

    res.status(200).json({
      message: "Shopping cart updated successfully",
      cart: newOrUpdatedCart,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a user ShoppingCart
 * @param req Request object containing userID
 * @params req.params.id User ID from the request parameters
 * @param res Response object
 * @param next Next function for error handling
 */

export async function deleteShoppingCart(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  const userIdParams = req.params.id;

  try {
    if (!user || !userIdParams) {
      throw new CustomError(
        "User not authenticated or userId not provided",
        401
      );
    }
    const userId = user._id ? user._id.toString() : null;
    if (userId !== userIdParams) {
      throw new CustomError("Unauthorized action", 403);
    }
    const parsedData = DeleteShoppingCartSchema.safeParse({ user: userId });
    if (!parsedData.success) {
      throw new CustomError(
        `Invalid user, Parse Errors: ${parsedData.error.errors}`,
        400
      );
    }
    const deletedCart = await deleteCart(userId);
    res.status(200).json({
      message: "Shopping cart deleted successfully",
      cart: deletedCart,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves the authenticated user's shopping cart, including product name and image details for each item.
 *
 * @returns A JSON response with the shopping cart and populated product details.
 *
 * @throws {CustomError} If the user is not authenticated or if the shopping cart is not found.
 */

export async function getShoppingCartByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;

    if (!user) {
      throw new CustomError("User not authenticated", 401);
    }

    const userShoppingCart = await ShoppingCart.findOne({
      user: user._id,
    }).populate({
      path: "items.product",
      select: "name imageUrl",
    });

    if (!userShoppingCart) {
      throw new CustomError("Shopping cart not found", 404);
    }

    res.status(200).json({
      message: "Shopping cart fetched successfully",
      cart: userShoppingCart,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Removes a specific item from the authenticated user's shopping cart.
 *
 * @param req - Express request object containing the authenticated user and item ID in parameters.
 * @param res - Express response object used to send the updated cart.
 * @param next - Express next middleware function for error handling.
 *
 * @throws {CustomError} If the user is not authenticated.
 * @throws {CustomError} If the item ID is missing from the request parameters.
 * @throws {CustomError} If the item is not found in the shopping cart or the cart is empty after deletion.
 */
export async function deleteShoppingCartItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;

    if (!user) {
      throw new CustomError("User not authenticated", 401);
    }

    const itemId = req.params.id;

    console.log("Item ID to delete:", itemId);

    if (!itemId) {
      throw new CustomError("Item ID is required", 400);
    }

    const newShoppingCart = await ShoppingCart.findOneAndUpdate(
      {
        user: user._id,
      },
      {
        $pull: { items: { _id: itemId } },
      },
      {
        new: true,
      }
    );

    console.log("Updated Shopping Cart:", newShoppingCart);

    if (!newShoppingCart || newShoppingCart.items.length === 0) {
      throw new CustomError("Item not found in shopping cart", 404);
    }

    res.status(200).json({
      message: "Item deleted successfully from shopping cart",
      cart: newShoppingCart,
    });
  } catch (error) {
    next(error);
  }
}

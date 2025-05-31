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
      data: shoppingCarts,
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
      productId,
      productVariant: { productSku, quantity },
    } = parsed.data.items[0];

    const newOrUpdatedCart = await AddOrUpdateCartItem({
      userId: user._id as mongoose.Types.ObjectId | string,
      productId,
      productSku,
      quantity,
    });

    res.status(200).json({
      message: "Shopping cart updated successfully",
      data: newOrUpdatedCart,
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
    const parsedData = DeleteShoppingCartSchema.safeParse({ userId });
    if (!parsedData.success) {
      throw new CustomError(
        `Invalid userId, Parse Errors: ${parsedData.error.errors}`,
        400
      );
    }
    const deletedCart = await deleteCart(userId);
    res.status(200).json({
      message: "Shopping cart deleted successfully",
      data: deletedCart,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific shopping cart by user ID
 * @param req Request object containing user information
 * @param res Response object
 * @param next Next function for error handling
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

    const userShoppingCart = await ShoppingCart.findOne({ userId: user._id });

    if (!userShoppingCart) {
      throw new CustomError("Shopping cart not found", 404);
    }

    res.status(200).json({
      message: "Shopping cart fetched successfully",
      data: userShoppingCart,
    });
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from "express";
import { Order, ShoppingCart } from "../database/models";
import mongoose from "mongoose";

/**
 * Creates a new order for the authenticated user based on the specified shopping cart.
 *
 * Extracts the shopping cart ID from the request body, verifies user authentication, checks that the cart is not empty, calculates the total price, and creates a new order with a status of "pending". Responds with the created order on success or an appropriate error message on failure.
 *
 * @remark Responds with 401 if the user is not authenticated, 400 if the shopping cart is empty or not found, and 500 if order creation fails.
 */
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const { shoppingCartId } = req.body;

    if (!shoppingCartId || typeof shoppingCartId !== "string") {
      res.status(400).json({ message: "Invalid shopping cart ID" });
      return;
    }

    const shoppingCartItems = await ShoppingCart.findOne(
      {
        _id: shoppingCartId,
        user: user._id,
      },
      "items"
    ).session(session);

    console.log("Shopping Cart Items: ", shoppingCartItems);

    if (!shoppingCartItems || shoppingCartItems.items.length === 0) {
      res.status(400).json({ message: "Shopping cart is empty" });
      return;
    }

    const totalPrice = shoppingCartItems.items
      .map((item: { totalPrice: number }) => item.totalPrice)
      .reduce((acc: number, price: number) => acc + price, 0);

    const newOrder = await Order.create(
      [
        {
          user: user._id,
          shoppingCart: shoppingCartId,
          totalPrice,
          items: shoppingCartItems.items,
          status: "pending",
        },
      ],
      { session }
    );

    console.log("New Order Created:", newOrder);

    if (!newOrder) {
      res.status(500).json({ message: "Failed to create order" });
      return;
    }

    const deleteCart =
      await ShoppingCart.findByIdAndDelete(shoppingCartId).session(session);

    console.log("Shopping Cart Deleted:", deleteCart);
    if (!deleteCart) {
      res.status(500).json({ message: "Failed to delete shopping cart" });
      return;
    }
    console.log("Shopping Cart Deleted");

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder[0],
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
}

/**
 * Logs the items and total price of a shopping cart specified by ID.
 *
 * @remark
 * This function does not send a response to the client; it only logs shopping cart details and forwards errors to the next middleware.
 */

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orders = await Order.find()
      .populate("user", "_id name email")
      .populate("shoppingCart", "items")
      .populate("items.product", "name price");

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
      return;
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves all orders associated with a specific user.
 *
 * Responds with a 200 status and the list of orders if found, or a 404 status if no orders exist for the user.
 */
export async function getOrderByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.params.userId;
    const user = req.user;

    if (user._id?.toString() !== userId && user.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const orders = await Order.find({ user: userId }).populate("shoppingCart");

    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found for this user" });
      return;
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
}

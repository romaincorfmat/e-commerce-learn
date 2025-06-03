import { NextFunction, Request, Response } from "express";
import { Order, ShoppingCart } from "../database/models";

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
  try {
    const { shoppingCartId } = req.body;
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const shoppingCartItems =
      await ShoppingCart.findById(shoppingCartId).select("items");

    if (!shoppingCartItems || shoppingCartItems.items.length === 0) {
      res.status(400).json({ message: "Shopping cart is empty" });
      return;
    }

    const totalPrice = shoppingCartItems.items
      .map((item: { totalPrice: number }) => item.totalPrice)
      .reduce((acc: number, price: number) => acc + price, 0)
      .toFixed(2);

    const newOrder = await Order.create({
      userId: user._id,
      shoppingCartId,
      totalPrice,
      items: shoppingCartItems.items,
      status: "pending",
    });

    console.log("New Order Created:", newOrder);

    if (!newOrder) {
      res.status(500).json({ message: "Failed to create order" });
      return;
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logs the items and total price of a shopping cart specified by ID.
 *
 * @remark
 * This function does not send a response to the client; it only logs shopping cart details and forwards errors to the next middleware.
 */
export async function getOrder(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { shoppingCartId } = req.body;
    const shoppingCartItems =
      await ShoppingCart.findById(shoppingCartId).select("items");

    console.log("Shopping Cart Items:", shoppingCartItems);

    const totalPrice = shoppingCartItems.items
      .map((item: { totalPrice: number }) => item.totalPrice)
      .reduce((acc: number, price: number) => acc + price, 0)
      .toFixed(2);

    console.log("Total Price:", totalPrice);
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
    const orders = await Order.find({ userId }).populate("shoppingCartId");

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

import { NextFunction, Request, Response } from "express";
import { Order, ShoppingCart } from "../database/models";

/**
 * Creates a new order for the authenticated user based on the provided shopping cart.
 *
 * Extracts the shopping cart ID from the request body, verifies user authentication, calculates the total price of items in the cart, and creates a new order with a status of "pending". Responds with the created order details or appropriate error messages.
 *
 * @param req - Express request object containing the shopping cart ID in the body and the authenticated user.
 * @param res - Express response object used to send status and order information.
 * @param next - Express next middleware function for error handling.
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
 * Retrieves and logs the items and total price of a shopping cart based on the provided shopping cart ID.
 *
 * @param req - Express request object containing the `shoppingCartId` in the body.
 * @param res - Express response object.
 * @param next - Express next middleware function for error handling.
 *
 * @remark This function does not send a response to the client.
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
 * Retrieves all orders associated with a specific user ID and returns them in the response.
 *
 * @param req - Express request object containing the user ID in {@link req.params.userId}.
 * @param res - Express response object used to send the list of orders or an error message.
 * @param next - Express next middleware function for error handling.
 *
 * @returns Sends a 200 response with the user's orders if found, or a 404 response if no orders exist for the user.
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

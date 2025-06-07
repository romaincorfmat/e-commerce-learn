import { NextFunction, Request, Response } from "express";
import { Order, ShoppingCart } from "../database/models";
import mongoose from "mongoose";

/**
 * Creates a new order for the authenticated user using the specified shopping cart.
 *
 * Validates the user's authentication and the provided shopping cart ID, ensures the cart is not empty, calculates the total price, creates a new order with status "pending", and deletes the shopping cart upon success. Responds with the created order or an appropriate error message.
 *
 * @remark Responds with 401 if the user is not authenticated, 400 if the shopping cart is invalid or empty, and 500 if order creation or cart deletion fails.
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

    const populatedOrder = await newOrder[0].populate("user", "_id name email");

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
      order: populatedOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
}

/**
 * Retrieves all orders with populated user, shopping cart, and product details.
 *
 * Responds with a list of orders including user information, shopping cart items, and product names and prices.
 *
 * @returns Sends a JSON response with the list of orders or a 404 status if none are found.
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
 * Retrieves all orders for a specified user, ensuring the requester is either the user themselves or an admin.
 *
 * Responds with a 200 status and the user's orders if found, or a 404 status if no orders exist for the user.
 *
 * @remark Returns a 403 status if the requester is not authorized to access the user's orders.
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

    const orders = await Order.find({ user: userId }).populate(
      "items.product",
      "name price"
    );

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

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      {
        _id: orderId,
        user: req.user._id,
      },
      {
        status,
      },
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
}

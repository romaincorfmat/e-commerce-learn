import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Category, Order, Product, User } from "../database/models";

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const totalOrders = await Order.countDocuments({}).session(session);
    const totalProducts = await Product.countDocuments({}).session(session);
    const totalCustomers = await User.countDocuments({
      role: "customer",
    }).session(session);
    const totalCategories = await Category.countDocuments({}).session(session);

    const allOrders = await Order.find({})
      .session(session)
      .select("totalPrice");

    const totalRevenue = allOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    const stats = {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalCategories,
      totalRevenue,
    };

    await session.commitTransaction();

    res.status(200).json({ success: true, stats });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};

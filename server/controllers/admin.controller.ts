import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Category, Order, Product, User } from "../database/models";
import { getEndOfYesterday, getStartOfDaysAgo } from "../utils/utils";

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const totalOrdersResult = await Order.aggregate([
      { $group: { _id: null, count: { $sum: 1 } } },
    ]).session(session);

    const totalOrders = totalOrdersResult[0]?.count || 0;

    const totalProductsResult = await Product.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]).session(session);

    const totalProducts = totalProductsResult[0]?.count || 0;

    const totalCustomersResult = await User.aggregate([
      { $match: { role: "customer" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]).session(session);

    const totalCustomers = totalCustomersResult[0]?.count || 0;

    const totalCategoriesResult = await Category.aggregate([
      { $group: { _id: null, count: { $sum: 1 } } },
    ]).session(session);

    const totalCategories = totalCategoriesResult[0]?.count || 0;

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const topSellingProductsResult = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          count: { $sum: "$items.productVariant.quantity" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        // Lookup product information from Product collection
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        // project the product name and count
        $project: {
          productId: "$_id",
          productName: { $arrayElemAt: ["$productInfo.name", 0] },
          count: 1,
          _id: 0,
        },
      },
    ]).session(session);

    const worstSellingProductsResult = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          count: { $sum: "$items.productVariant.quantity" },
        },
      },
      { $sort: { count: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $project: {
          productId: "$_id",
          productName: { $arrayElemAt: ["$productInfo.name", 0] },
          count: 1,
          _id: 0,
        },
      },
    ]).session(session);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            // Greater than or equal to last month 00:00:00
            $gte: getStartOfDaysAgo(30),
            $lt: getEndOfYesterday(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]).session(session);

    const yesterdayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            // Greater than or equal to yesterday 00:00:00
            $gte: getStartOfDaysAgo(1),
            // Less than today 00:00:00
            $lt: getEndOfYesterday(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]).session(session);

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: getEndOfYesterday() },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]).session(session);

    const stats = {
      totalOrders,
      totalProducts,
      totalCustomers,
      totalCategories,
      totalRevenue,
      topSellingProducts: topSellingProductsResult,
      worstSellingProducts: worstSellingProductsResult,
      monthlyRevenue:
        monthlyRevenue.length > 0 ? monthlyRevenue[0].totalRevenue : 0,
      todayRevenue: todayRevenue.length > 0 ? todayRevenue[0].totalRevenue : 0,
      yesterdayRevenue:
        yesterdayRevenue.length > 0 ? yesterdayRevenue[0].totalRevenue : 0,
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

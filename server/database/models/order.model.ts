import mongoose, { Document, model, models, Types } from "mongoose";
import { ICartItem, CartItemSchema } from "./shopping-cart.model";

export interface IOrder {
  user: Types.ObjectId;
  shoppingCart: Types.ObjectId;
  items: [ICartItem];
  totalPrice: number;
  orderDate: Date;
  status: "pending" | "completed" | "cancelled";
}

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shoppingCart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingCart",
      required: true,
    },
    items: [CartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = models?.Order || model<IOrder>("Order", OrderSchema);

export default Order;

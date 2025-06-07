// server/types/invoice.types.ts

import { Types } from "mongoose";

// User information that will be populated in the order
interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

// Product information that will be populated in order items
interface PopulatedProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
}

// Variant information for the product
interface ProductVariant {
  _id?: Types.ObjectId;
  productSku: string;
  price: number;
  quantity: number;
}

// A single item in the order with populated product info
interface PopulatedOrderItem {
  _id: Types.ObjectId;
  product: PopulatedProduct;
  productVariant: ProductVariant;
  quantity: number;
  totalPrice: number;
}

// The fully populated order for invoice generation
export interface InvoiceOrder {
  _id: Types.ObjectId;
  user: PopulatedUser;
  items: PopulatedOrderItem[];
  totalPrice: number;
  orderDate: Date;
  status: "pending" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

import mongoose, { Document, Types, models, model } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  productVariant: {
    productSku: string;
    quantity: number;
    unitPrice: number;
  };
  totalPrice: number;
  addedAt: Date;
}

export interface ICartItemDocument extends ICartItem, Document {}

export const CartItemSchema = new mongoose.Schema<ICartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Only 1 product can be added at the same time
    // Click on button Add to Cart for each item
    productVariant: {
      productSku: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
    },

    totalPrice: {
      type: Number,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export interface IShoppingCart {
  user: Types.ObjectId;
  items: ICartItem[];
}

const shoppingCartSchema = new mongoose.Schema<IShoppingCart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

const ShoppingCart =
  models?.ShoppingCart ||
  model<IShoppingCart>("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;

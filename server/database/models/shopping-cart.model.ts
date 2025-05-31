import mongoose, { Types, models, model } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  productVariant: {
    productSku: string;
    quantity: number;
    unitPrice: number;
  };
  totalPrice: number;
  addedAt: Date;
}

const cartItemSchema = new mongoose.Schema<ICartItem>(
  {
    productId: {
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
  userId: Types.ObjectId;
  items: ICartItem[];
}

const shoppingCartSchema = new mongoose.Schema<IShoppingCart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const ShoppingCart =
  models?.ShoppingCart ||
  model<IShoppingCart>("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;

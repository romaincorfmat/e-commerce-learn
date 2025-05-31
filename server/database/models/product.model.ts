import mongoose, { Types } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: Types.ObjectId;
  variants: [
    {
      sku: string;
      stockLevel?: number;
      attributes: {
        color?: string;
        size?: string;
      };
    },
  ];
  deleted: boolean; // Soft delete flag
}

export interface IProductDocument extends IProduct, Document {}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    variants: [
      {
        sku: {
          type: String,
          required: true,
          unique: true,
        },
        stockLevel: {
          type: Number,
          required: true,
          min: 0,
        },
        attributes: {
          color: {
            type: String,
            trim: true,
          },
          size: {
            type: String,
            trim: true,
          },
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models?.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
export default Product;

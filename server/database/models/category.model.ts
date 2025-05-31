import mongoose, { Document, models } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
}

export interface ICategoryDocument extends ICategory, Document {}

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category =
  models?.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

import { NextFunction, Request, Response } from "express";
import { Category } from "../database/models";
import { CustomError } from "../types/error";

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser || loggedInUser.role !== "admin") {
      const error = new CustomError(
        "Unauthorized access -- Only Admin can Create Categories",
        403
      );
      throw error;
    }

    const { name } = req.body;

    if (!name) {
      const error = new CustomError("Category name is required", 400);
      throw error;
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
      const error = new CustomError("Category already exists", 409);
      throw error;
    }

    const newCategory = await Category.create({
      name,
      slug,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categoryId = req.params.id;

  if (!categoryId) {
    throw new CustomError("Category ID is required", 400);
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const categoryId = req.params.id;

  if (!categoryId) {
    throw new CustomError("Category ID is required", 400);
  }

  try {
    const loggedInUser = req.user;
    if (!loggedInUser || loggedInUser.role !== "admin") {
      const error = new CustomError(
        "Unauthorized access -- Only Admin can delete Categories",
        403
      );
      throw error;
    }

    const categoryToDelete = await Category.findByIdAndDelete(categoryId);

    if (!categoryToDelete) {
      throw new CustomError("Category not found", 404);
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: categoryToDelete,
    });
  } catch (error) {
    next(error);
  }
}

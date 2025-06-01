import { z } from "zod";

export const SignUpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const CreateUserFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  role: z.string().min(1, "Role is required"),
});

export const CreateProductFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  categoryId: z.string().min(1, "Category is required"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  variants: z.array(
    z.object({
      sku: z.string().min(1, "Variant sku is required"),
      stockLevel: z
        .number()
        .int()
        .nonnegative("Variant stock must be a non-negative integer"),
      attributes: z.object({
        color: z.string().min(1, "Color is required"),
        size: z.string().min(1, "Size is required"),
      }),
    })
  ),
});

export const CreateCategoryFormSchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters long"),
});

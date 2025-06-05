import z from "zod";

export const cartItemSchema = z.object({
  product: z.object({
    _id: z.string().min(1, { message: "_ID is required" }),
    name: z.string().min(1, { message: "Product Name is required" }),
    unitPrice: z.number().min(1, { message: "Unit Price is required" }),
  }),
  productVariant: z.object({
    productSku: z.string().min(1),
    quantity: z.number().int().positive(),
  }),
});

export const CreateShoppingCartBodySchema = z.object({
  items: z.array(cartItemSchema).min(1),
});

export const DeleteShoppingCartSchema = z.object({
  user: z.string().min(1, "User is required"),
});

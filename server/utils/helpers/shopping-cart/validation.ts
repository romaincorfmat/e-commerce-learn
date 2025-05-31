import z from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  productVariant: z.object({
    productSku: z.string().min(1),
    quantity: z.number().int().positive(),
  }),
});

export const CreateShoppingCartBodySchema = z.object({
  items: z.array(cartItemSchema).min(1),
});

export const DeleteShoppingCartSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

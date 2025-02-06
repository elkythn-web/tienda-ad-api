import { z } from 'zod';

export const CartItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().min(1),
  price: z.number().positive()
});

export const CartSchema = z.object({
  user_id: z.string(),
  items: z.array(CartItemSchema)
});


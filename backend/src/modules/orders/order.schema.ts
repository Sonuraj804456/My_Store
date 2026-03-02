import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().min(1),
  buyerName: z.string().min(1),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(5),
  shippingAddress: z.object({
    line1: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.enum(["ONLINE", "COD"]),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "RETURNED",
    "CANCELLED",
  ]),
});

export const refundSchema = z.object({
  refundAmount: z.number().positive(),
});
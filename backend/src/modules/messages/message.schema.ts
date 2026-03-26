import { z } from "zod";

export const buyerMessageSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  content: z.string().trim().min(1).max(2000),
});

export const creatorMessageSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

export const adminDisputeSchema = z.object({
  isDisputed: z.boolean(),
});

import { z } from "zod";

/* =========================================================
   PRODUCT
========================================================= */

export const createProductSchema = z.object({
  title: z.string().min(1).max(120),

  description: z
    .string()
    .max(2000)
    .optional()
    .nullable(),

  isFeatured: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(1).max(120).optional(),

  description: z
    .string()
    .max(2000)
    .optional()
    .nullable(),

  isFeatured: z.boolean().optional(),

  status: z
    .enum(["draft", "published", "archived"])
    .optional(),
});

/* =========================================================
   CATEGORY
========================================================= */

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
});

/* =========================================================
   VARIANT
========================================================= */

export const createVariantSchema = z.object({
  name: z.string().min(1).max(50),

  // accept number but ensure 2 decimal precision
  price: z
    .number()
    .positive()
    .refine(
      (val) => Number(val.toFixed(2)) === val,
      "Price must have max 2 decimal places"
    ),

  inventory: z.number().int().min(0),
});

export const updateVariantSchema = z.object({
  name: z.string().min(1).max(50).optional(),

  price: z
    .number()
    .positive()
    .refine(
      (val) => Number(val.toFixed(2)) === val,
      "Price must have max 2 decimal places"
    )
    .optional(),

  inventory: z.number().int().min(0).optional(),
});

/* =========================================================
   MEDIA
========================================================= */

export const createMediaSchema = z.object({
  url: z.string().url(),

  type: z.enum(["image", "video"]),

  position: z.number().int().min(0),
});
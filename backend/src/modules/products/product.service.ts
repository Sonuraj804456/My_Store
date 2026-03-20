import { eq, and, isNull, inArray } from "drizzle-orm";
import {
  products,
  categories,
  productVariants,
  productMedia,
  productCategories,
} from "./product.db";
import { ApiError } from "../shared/api-error";
import { db } from "../../config/db";

import { stores } from "../stores/store.db";

const getStoreByUser = async (userId: string) => {
  console.log("Looking for store with userId:", userId);

  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.userId, userId),
  });

  console.log("Store found:", store);

  if (!store) {
    throw new ApiError(404, "Store not found for this user");
  }

  return store;
};

/* =========================================================
   CATEGORY
========================================================= */

export const createCategory = async (
  storeId: string,
  name: string
) => {
  try {
    const [category] = await db
      .insert(categories)
      .values({
        storeId,
        name,
      })
      .returning();

    return category;
  } catch {
    throw new ApiError(409, "Category already exists in this store");
  }
};

export const listCategories = async (storeId: string) => {
  return db
    .select()
    .from(categories)
    .where(eq(categories.storeId, storeId));
};

/* =========================================================
   PRODUCT
========================================================= */

export const createProduct = async (
  storeId: string,
  data: {
    title: string;
    description?: string;
    isFeatured?: boolean;
    productType?: "PHYSICAL" | "DIGITAL";
    categoryIds?: string[];
  }
) => {
  return await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(products)
      .values({
        title: data.title,
        description: data.description ?? null,
        isFeatured: data.isFeatured ?? false,
        productType: data.productType ?? "PHYSICAL",
        storeId: storeId, // ✅ direct
        status: "draft",
      })
      .returning();

    if (!inserted.length) {
      throw new ApiError(500, "Failed to create product");
    }

    const product = inserted[0]!;

    // categories logic same...
    return product;
  });
};
export const getOwnProducts = async (storeId: string) => {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.storeId, storeId),
        isNull(products.deletedAt)
      )
    );
};

export const getSingleProduct = async (
  storeId: string,
  productId: string
) => {
  const product = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.storeId, storeId),
        isNull(products.deletedAt)
      )
    )
    .then((r) => r[0]);

  if (!product) throw new ApiError(404, "Product not found");

  return product;
};

/* =========================================================
   PUBLISH VALIDATION
========================================================= */

const validatePublishing = async (productId: string) => {
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

  const media = await db
    .select()
    .from(productMedia)
    .where(eq(productMedia.productId, productId));

  if (variants.length === 0)
    throw new ApiError(400, "At least one variant required");

  if (media.length === 0)
    throw new ApiError(400, "At least one media required");

  if (variants.some((v) => v.inventory < 0))
    throw new ApiError(400, "Inventory cannot be negative");

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) throw new ApiError(404, "Product not found");

  const hasFileMedia = media.some((m) => m.type === "file");

  if (product.productType === "DIGITAL" && !hasFileMedia) {
    throw new ApiError(400, "Digital products require at least one file media");
  }

  if (product.productType === "PHYSICAL" && hasFileMedia) {
    throw new ApiError(400, "Physical products cannot have file media");
  }
};

export const updateProduct = async (
  storeId: string,
  productId: string,
  data: any
) => {
  const product = await getSingleProduct(storeId, productId);

  if (data.status === "published") {
    await validatePublishing(productId);
  }

  const [updated] = await db
    .update(products)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(products.id, productId),
        eq(products.storeId, storeId)
      )
    )
    .returning();

  return updated;
};

/* =========================================================
   VARIANTS
========================================================= */

export const addVariant = async (
  storeId: string,
  productId: string,
  data: any
) => {
  await getSingleProduct(storeId, productId);

  const [variant] = await db
    .insert(productVariants)
    .values({ ...data, productId })
    .returning();

  return variant;
};

export const updateVariant = async (
  storeId: string,
  productId: string,
  variantId: string,
  data: any
) => {
  await getSingleProduct(storeId, productId);

  const [updated] = await db
    .update(productVariants)
    .set(data)
    .where(
      and(
        eq(productVariants.id, variantId),
        eq(productVariants.productId, productId)
      )
    )
    .returning();

  return updated;
};

export const deleteVariant = async (
  storeId: string,
  productId: string,
  variantId: string
) => {
  const product = await getSingleProduct(storeId, productId);

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

  if (product.status === "published" && variants.length <= 1) {
    throw new ApiError(
      400,
      "Cannot delete last variant of published product"
    );
  }

  await db
    .delete(productVariants)
    .where(
      and(
        eq(productVariants.id, variantId),
        eq(productVariants.productId, productId)
      )
    );
};

/* =========================================================
   MEDIA
========================================================= */

export const addMedia = async (
  storeId: string,
  productId: string,
  data: any
) => {
  const product = await getSingleProduct(storeId, productId);

  if (product.productType === "PHYSICAL" && data.type === "file") {
    throw new ApiError(400, "Physical products cannot attach file media");
  }

  const existing = await db
    .select()
    .from(productMedia)
    .where(eq(productMedia.productId, productId));

  if (existing.length >= 10)
    throw new ApiError(400, "Maximum 10 media allowed");

  const [media] = await db
    .insert(productMedia)
    .values({ ...data, productId })
    .returning();

  return media;
};

export const removeMedia = async (
  storeId: string,
  productId: string,
  mediaId: string
) => {
  await getSingleProduct(storeId, productId);

  await db
    .delete(productMedia)
    .where(
      and(
        eq(productMedia.id, mediaId),
        eq(productMedia.productId, productId)
      )
    );
};

/* =========================================================
   SOFT DELETE
========================================================= */

export const softDeleteProduct = async (
  storeId: string,
  productId: string
) => {
  await getSingleProduct(storeId, productId);

  await db
    .update(products)
    .set({ deletedAt: new Date() })
    .where(
      and(
        eq(products.id, productId),
        eq(products.storeId, storeId)
      )
    );
};

/* =========================================================
   PUBLIC APIs
========================================================= */

export const listPublishedByStore = async (
  username: string
) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.username, username),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.storeId, store.id),
        eq(products.status, "published"),
        isNull(products.deletedAt)
      )
    );
};

export const getSinglePublishedProduct = async (
  username: string,
  productId: string
) => {
  const store = await db.query.stores.findFirst({
    where: (stores, { eq }) => eq(stores.username, username),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const product = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.storeId, store.id),
        eq(products.status, "published"),
        isNull(products.deletedAt)
      )
    )
    .then((r) => r[0]);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};
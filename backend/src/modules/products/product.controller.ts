import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import * as service from "./product.service";
import { ApiError } from "../shared/api-error";
import { db } from "../../config/db";
import { stores } from "../stores/store.db";

/* =========================================================
   Helper: Resolve Store From Logged In User
========================================================= */

const getUserStore = async (userId: string) => {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (!store) {
    throw new ApiError(404, "Store not found for this user");
  }

  if (store.isSuspended) {
    throw new ApiError(403, "Store is suspended");
  }

  return store;
};

/* =========================================================
   CATEGORY
========================================================= */

export const createCategory = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const store = await getUserStore(req.user.id);

  const category = await service.createCategory(
    store.id,
    req.body.name
  );

  res.status(201).json(category);
};

export const listCategories = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const store = await getUserStore(req.user.id);

  const categories = await service.listCategories(store.id);
  res.json(categories);
};

/* =========================================================
   PRODUCT (CREATOR)
========================================================= */

export const createProduct = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const store = await getUserStore(req.user.id);

  const product = await service.createProduct(
    store.id,   // ✅ now correct
    req.body
  );

  res.status(201).json(product);
};
export const getOwnProducts = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const store = await getUserStore(req.user.id);

  const products = await service.getOwnProducts(store.id);
  res.json(products);
};

export const getSingleProduct = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const id = req.params.id;
  if (typeof id !== "string") throw new ApiError(400, "Invalid product id");

  const store = await getUserStore(req.user.id);

  const product = await service.getSingleProduct(store.id, id);
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const id = req.params.id;
  if (typeof id !== "string") throw new ApiError(400, "Invalid product id");

  const store = await getUserStore(req.user.id);

  const product = await service.updateProduct(
    store.id,
    id,
    req.body
  );

  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const id = req.params.id;
  if (typeof id !== "string") throw new ApiError(400, "Invalid product id");

  const store = await getUserStore(req.user.id);

  await service.softDeleteProduct(store.id, id);

  res.status(204).send();
};

/* =========================================================
   VARIANTS
========================================================= */

export const addVariant = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const productId = req.params.id;
  if (typeof productId !== "string")
    throw new ApiError(400, "Invalid product id");

  const store = await getUserStore(req.user.id);

  const variant = await service.addVariant(
    store.id,
    productId,
    req.body
  );

  res.status(201).json(variant);
};

export const updateVariant = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const { id: productId, variantId } = req.params;

  if (typeof productId !== "string" || typeof variantId !== "string")
    throw new ApiError(400, "Invalid id");

  const store = await getUserStore(req.user.id);

  const variant = await service.updateVariant(
    store.id,
    productId,
    variantId,
    req.body
  );

  res.json(variant);
};

export const deleteVariant = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const { id: productId, variantId } = req.params;

  if (typeof productId !== "string" || typeof variantId !== "string")
    throw new ApiError(400, "Invalid id");

  const store = await getUserStore(req.user.id);

  await service.deleteVariant(store.id, productId, variantId);
  res.status(204).send();
};

/* =========================================================
   MEDIA
========================================================= */

export const addMedia = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const productId = req.params.id;
  if (typeof productId !== "string")
    throw new ApiError(400, "Invalid product id");

  const store = await getUserStore(req.user.id);

  const media = await service.addMedia(
    store.id,
    productId,
    req.body
  );

  res.status(201).json(media);
};

export const removeMedia = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new ApiError(401, "Unauthorized");

  const { id: productId, mediaId } = req.params;

  if (typeof productId !== "string" || typeof mediaId !== "string")
    throw new ApiError(400, "Invalid id");

  const store = await getUserStore(req.user.id);

  await service.removeMedia(store.id, productId, mediaId);
  res.status(204).send();
};

/* =========================================================
   PUBLIC APIs
========================================================= */

export const listPublishedByStore = async (req: Request, res: Response) => {
  const username = req.params.username;
  if (typeof username !== "string")
    throw new ApiError(400, "Invalid store username");

  const products = await service.listPublishedByStore(username);
  res.json(products);
};

export const getSinglePublishedProduct = async (
  req: Request,
  res: Response
) => {
  const { username, productId } = req.params;

  if (typeof username !== "string" || typeof productId !== "string")
    throw new ApiError(400, "Invalid params");

  const product = await service.getSinglePublishedProduct(
    username,
    productId
  );

  res.json(product);
};


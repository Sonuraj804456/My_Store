import { Request, Response } from "express";
import { ApiError } from "../shared/api-error";
import { downloadService } from "./download.service";
import { db } from "../../config/db";
import { products } from "../products/product.db";
import { stores } from "../stores/store.db";
import { orders } from "../orders/order.db";
import { Roles } from "../types/roles";
import { eq } from "drizzle-orm";

const getUserStore = async (userId: string) => {
  const store = await db.query.stores.findFirst({
    where: (storesTable, { eq }) => eq(storesTable.userId, userId),
  });

  if (!store) throw new ApiError(404, "Store not found for this user");

  return store;
};

export const downloadController = {
  publicDownload: async (req: Request, res: Response) => {
    const token = req.params.token;
    if (typeof token !== "string") throw new ApiError(400, "Invalid token");

    const ip = req.ip || req.headers["x-forwarded-for"] || "";
    const userAgent =
      (req.headers["user-agent"] as string) || "unknown";

    const result = await downloadService.resolveToken(
      token,
      String(ip),
      String(userAgent)
    );

    res.json(result);
  },

  creatorList: async (req: Request, res: Response) => {
    if (!req.user?.id) throw new ApiError(401, "Unauthorized");
    const productId = req.params.id;
    if (typeof productId !== "string") throw new ApiError(400, "Invalid product id");

    const store = await getUserStore(req.user.id);

    const product = await db.query.products.findFirst({
      where: (p, { eq }) =>
        eq(p.id, productId) && eq(p.storeId, store.id),
    });

    if (!product) throw new ApiError(404, "Product not found");

    const downloads = await downloadService.listByProduct(productId);

    return res.json({ success: true, data: downloads, error: null });
  },

  getTokenByOrder: async (req: Request, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    const orderId = req.params.orderId;
    if (!orderId || typeof orderId !== "string")
      throw new ApiError(400, "Invalid order id");

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) throw new ApiError(404, "Order not found");
    if (order.status !== "PAID") throw new ApiError(400, "Order not paid");

    const role = req.user.role as Roles;

    if (role === Roles.BUYER) {
      if (order.buyerId !== req.user.id) throw new ApiError(403, "Forbidden");
    } else if (role === Roles.CREATOR) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, order.productId),
      });
      if (!product) throw new ApiError(404, "Product not found");

      const store = await db.query.stores.findFirst({
        where: eq(stores.id, product.storeId),
      });
      if (!store) throw new ApiError(404, "Store not found");
      if (store.userId !== req.user.id) throw new ApiError(403, "Forbidden");
    } else if (role !== Roles.ADMIN) {
      throw new ApiError(403, "Forbidden");
    }

    const download = await downloadService.findByOrderId(orderId);
    if (!download) throw new ApiError(404, "Download token not found");

    res.json({ success: true, data: { token: download.token }, error: null });
  },

  adminList: async (req: Request, res: Response) => {
    const downloads = await downloadService.listAll();
    const sanitized = downloads.map((d) => ({
      orderId: d.orderId,
      productId: d.productId,
      variantId: d.variantId,
      downloadCount: d.downloadCount,
      createdAt: d.createdAt,
    }));
    res.json(sanitized);
  },
};

import crypto from "crypto";
import { ApiError } from "../shared/api-error";
import { db } from "../../config/db";
import { products, productMedia } from "../products/product.db";
import { digitalDownloads, downloadDb, downloadLogs } from "./download.db";
import { orders } from "../orders/order.db";
import { and, eq } from "drizzle-orm";

const toHexToken = () => crypto.randomBytes(32).toString("hex");

export const downloadService = {
  createDigitalDownload: async (
    orderId: string,
    productId: string,
    variantId: string
  ) => {
    const existing = await downloadDb.findByOrderId(orderId);
    if (existing) return existing;

    const token = toHexToken();

    const [download] = await downloadDb.create({
      orderId,
      productId,
      variantId,
      token,
      maxDownloads: null,
      downloadCount: 0,
      expiresAt: null,
    });

    if (!download) {
      throw new ApiError(500, "Failed to create digital download record");
    }

    return download;
  },

  findByOrderId: async (orderId: string) => {
    return downloadDb.findByOrderId(orderId);
  },

  resolveToken: async (token: string, ip: string, userAgent: string) => {
    const record = await downloadDb.findByToken(token);
    if (!record) throw new ApiError(404, "Invalid download token");

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, record.orderId),
    });

    if (!order) throw new ApiError(404, "Order not found");

    if (order.status === "CANCELLED") {
      throw new ApiError(400, "Order is cancelled");
    }

    if (order.isRefunded) {
      throw new ApiError(400, "Order has been refunded");
    }

    if (order.status !== "PAID") {
      throw new ApiError(400, "Order not paid");
    }

    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      throw new ApiError(400, "Download token expired");
    }

    if (
      record.maxDownloads !== null &&
      record.downloadCount >= record.maxDownloads
    ) {
      throw new ApiError(400, "Download limit reached");
    }

    const fileMedia = await db
      .select()
      .from(productMedia)
      .where(
        and(
          eq(productMedia.productId, record.productId),
          eq(productMedia.type, "file")
        )
      );

    if (fileMedia.length === 0 || !fileMedia[0]) {
      throw new ApiError(400, "No file media available for this product");
    }

    await downloadDb.incrementCount(record.id);
    await downloadDb.logAccess({
      digitalDownloadId: record.id,
      ipAddress: ip,
      userAgent,
    });

    return { url: fileMedia[0]!.url };
  },

  listByProduct: async (productId: string) => {
    return downloadDb.listByProductId(productId);
  },

  listAll: async () => {
    return downloadDb.listAll();
  },
};

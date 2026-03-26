import { ApiError } from "../shared/api-error";
import { orderDb, OrderStatus } from "./order.db";
import { payoutService } from "../payout/payout.service";
import { jobDb } from "../jobs/job.db";
import { db } from "../../config/db";
import { products, productVariants } from "../products/product.db";
import { stores } from "../stores/store.db";
import { downloadService } from "../download/download.service";
import { eq, and, isNull } from "drizzle-orm";

/* ================= LIFECYCLE ================= */

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  RETURNED: [],
  CANCELLED: [],
};

function validateTransition(
  current: OrderStatus,
  next: OrderStatus
) {
  if (current === next) {
    throw new ApiError(400, "Order already in this status");
  }

  if (!allowedTransitions[current].includes(next)) {
    throw new ApiError(
      400,
      `Invalid transition from ${current} to ${next}`
    );
  }
}

const handleStatusChangeToPaid = async (orderId: string) => {
  const order = await orderDb.findById(orderId);
  if (!order) return;

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, order.productId), isNull(products.deletedAt)),
  });

  if (!product) return;

  if (product.productType === "DIGITAL") {
    await downloadService.createDigitalDownload(
      order.id,
      order.productId,
      order.variantId
    );
  }
};

const handleStatusChangeToDelivered = async (order: any) => {
  if (!order) return;
  await payoutService.createPayoutForOrder(order);

  // Create EMAIL job to notify buyer
  try {
    const buyer = await orderDb.findBuyerById(order.buyerId);
    if (buyer) {
      await jobDb.create({
        type: "EMAIL",
        payload: {
          to: buyer.email,
          template: "ORDER_STATUS_UPDATED",
          data: {
            orderId: order.id,
            status: "DELIVERED",
            updatedAt: new Date(),
          },
        },
        status: "PENDING",
        runAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to create status update email job:", error);
  }
};

const handleStatusChangeToCancelledOrReturned = async (order: any) => {
  if (!order) return;
  await payoutService.cancelByOrderId(order.id);
};

/* ================= SERVICE ================= */

export const orderService = {
  /* ================= CREATE ORDER ================= */

  async createOrder(data: any) {
    /* -------- Resolve Product -------- */

    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, data.productId),
        eq(products.status, "published"),
        isNull(products.deletedAt)
      ),
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    /* -------- Resolve Variant -------- */

    const variant = await db.query.productVariants.findFirst({
      where: and(
        eq(productVariants.id, data.variantId),
        eq(productVariants.productId, product.id)
      ),
    });

    if (!variant) {
      throw new ApiError(404, "Variant not found");
    }

    /* -------- Resolve Store -------- */

    const store = await db.query.stores.findFirst({
      where: eq(stores.id, product.storeId),
    });

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    if (!store.isPublic || store.isVacationMode) {
      throw new ApiError(400, "Store not accepting orders");
    }

    /* -------- Resolve Buyer -------- */

    let buyer = await orderDb.findBuyer(
      data.buyerEmail,
      data.buyerPhone
    );

    if (!buyer) {
      const createdBuyer = await orderDb.createBuyer({
        email: data.buyerEmail,
        phone: data.buyerPhone,
        name: data.buyerName,
      });

      if (!createdBuyer.length) {
        throw new ApiError(500, "Failed to create buyer");
      }

      buyer = createdBuyer[0]!;
    }

    /* -------- Price Freeze -------- */

    const priceAtPurchase = Number(variant.price);
    const totalAmount = priceAtPurchase * data.quantity;

    /* -------- Create Order -------- */

    const createdOrder = await orderDb.create({
      ...data,
      storeId: store.id,
      priceAtPurchase,
      totalAmount,
      buyerId: buyer.id,
      status: "PENDING" as OrderStatus,
    });

    if (!createdOrder.length) {
      throw new ApiError(500, "Failed to create order");
    }

    const order = createdOrder[0]!;

    // Create EMAIL job to notify buyer
    try {
      await jobDb.create({
        type: "EMAIL",
        payload: {
          to: data.buyerEmail,
          template: "ORDER_CREATED",
          data: {
            orderId: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
            productName: data.productName || "Your Order",
          },
        },
        status: "PENDING",
        runAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to create email job:", error);
      // Don't fail the order creation if job creation fails
    }

    return {
      orderId: order.id,
      status: order.status,
      totalAmount,
    };
  },

  /* ================= LIST ================= */

  async listOrdersForCreator(userId: string) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (!store) {
    throw new ApiError(404, "Store not found for this user");
  }

  return orderDb.listByStore(store.id);
},

  async listOrdersForBuyer(userId: string) {
    const orders = await orderDb.listByBuyer(userId);

    // For each order, if it's paid and digital product, include download token
    const ordersWithDownloads = await Promise.all(
      orders.map(async (order) => {
        const product = await db.query.products.findFirst({
          where: and(eq(products.id, order.productId), isNull(products.deletedAt)),
        });

        let download = null;
        if (order.status === "PAID" && product?.productType === "DIGITAL") {
          download = await downloadService.findByOrderId(order.id);
        }

        return {
          ...order,
          download: download ? { token: download.token } : null,
        };
      })
    );

    return ordersWithDownloads;
  },

  async listAllOrders() {
    return orderDb.listAll();
  },

  /* ================= STATUS UPDATE ================= */

  async updateStatusCreator(
  orderId: string,
  status: OrderStatus,
  userId: string
) {
  const store = await db.query.stores.findFirst({
    where: eq(stores.userId, userId),
  });

  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const order = await orderDb.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.storeId !== store.id) {
    throw new ApiError(403, "Access denied");
  }

  validateTransition(order.status as OrderStatus, status);

  await orderDb.updateStatus(orderId, status);

  if (status === "PAID") {
    await handleStatusChangeToPaid(orderId);
  }

  if (status === "DELIVERED") {
    await handleStatusChangeToDelivered(order);
  }

  if (status === "CANCELLED" || status === "RETURNED") {
    await handleStatusChangeToCancelledOrReturned(order);
  }
},


  async updateStatusAdmin(
    orderId: string,
    status: OrderStatus
  ) {
    const order = await orderDb.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await orderDb.updateStatus(orderId, status);

    if (status === "PAID") {
      await handleStatusChangeToPaid(orderId);
    }

    if (status === "DELIVERED") {
      await handleStatusChangeToDelivered(order);
    }

    if (status === "CANCELLED" || status === "RETURNED") {
      await handleStatusChangeToCancelledOrReturned(order);
    }
  },

  /* ================= REFUND ================= */

  async markRefund(
    orderId: string,
    refundAmount: number,
    userId: string
  ) {
    const order = await orderDb.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    const store = await db.query.stores.findFirst({
      where: eq(stores.userId, userId),
    });

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    if (order.storeId !== store.id) {
      throw new ApiError(403, "Access denied");
    }

    if (refundAmount > Number(order.totalAmount)) {
      throw new ApiError(400, "Refund exceeds total amount");
    }

    await orderDb.updateRefund(orderId, {
      isRefunded: true,
      refundAmount,
    });

    await payoutService.applyRefund(order, refundAmount);
  },

  /* ================= SOFT DELETE ================= */

  async softDeleteOrder(orderId: string) {
    const order = await orderDb.findById(orderId);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await orderDb.softDelete(orderId);
  },
};
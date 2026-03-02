import { ApiError } from "../shared/api-error";
import { orderDb, OrderStatus } from "./order.db";
import { db } from "../../config/db";
import { products, productVariants } from "../products/product.db";
import { stores } from "../stores/store.db";
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
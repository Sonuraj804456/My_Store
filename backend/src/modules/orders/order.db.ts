import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { eq, and, isNull, gte, lte } from "drizzle-orm";
import { db } from "../../config/db";
import { customers } from "../auth/auth.schema";

/* ================= ENUMS ================= */

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "RETURNED",
  "CANCELLED",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "ONLINE",
  "COD",
]);

export type OrderStatus =
  typeof orderStatusEnum.enumValues[number];

/* ================= TABLES ================= */

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").notNull(),
  productId: uuid("product_id").notNull(),
  variantId: uuid("variant_id").notNull(),
  customerId: uuid("customer_id").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  isRefunded: boolean("is_refunded").default(false),
  refundAmount: numeric("refund_amount"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

/* ================= DB FUNCTIONS ================= */

export const orderDb = {
  create: (data: any) =>
    db.insert(orders).values(data).returning(),

  findBuyer: (email: string, phone: string) =>
    db.query.customers.findFirst({
      where: and(eq(customers.email, email), eq(customers.phone, phone)),
    }),

  findBuyerById: (id: string) =>
    db.query.customers.findFirst({
      where: eq(customers.id, id),
    }),

  createBuyer: (data: any) =>
    db.insert(customers)
      .values(data)
      .returning()
      .then((rows) => rows[0]),

  findById: (id: string) =>
    db.query.orders.findFirst({
      where: and(eq(orders.id, id), isNull(orders.deletedAt)),
    }),

  updateStatus: (id: string, status: OrderStatus) =>
    db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id)),

  updateRefund: (id: string, data: any) =>
    db.update(orders).set(data).where(eq(orders.id, id)),

  listByStore: (
    storeId: string,
    filters?: {
      status?: OrderStatus;
      from?: string;
      to?: string;
    }
  ) => {
    const clauses: any[] = [eq(orders.storeId, storeId), isNull(orders.deletedAt)];

    if (filters?.status) {
      clauses.push(eq(orders.status, filters.status));
    }

    const from = filters?.from ? new Date(filters.from) : undefined;
    const to = filters?.to ? new Date(filters.to) : undefined;

    if (from && !Number.isNaN(from.getTime())) {
      clauses.push(gte(orders.createdAt, from));
    }

    if (to && !Number.isNaN(to.getTime())) {
      clauses.push(lte(orders.createdAt, to));
    }

    return db.query.orders.findMany({
      where: and(...clauses),
    });
  },

  listByCustomer: (customerId: string) =>
    db.query.orders.findMany({
      where: and(eq(orders.customerId, customerId), isNull(orders.deletedAt)),
    }),

  listAll: () =>
    db.query.orders.findMany({
      where: isNull(orders.deletedAt),
    }),

  softDelete: (id: string) =>
    db
      .update(orders)
      .set({ deletedAt: new Date() })
      .where(eq(orders.id, id)),
};
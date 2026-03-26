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
import { eq, and, isNull } from "drizzle-orm";
import { db } from "../../config/db";

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
  buyerId: uuid("buyer_id"),
  buyerEmail: varchar("buyer_email", { length: 255 }).notNull(),
  buyerPhone: varchar("buyer_phone", { length: 20 }).notNull(),
  buyerName: varchar("buyer_name", { length: 255 }).notNull(),
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

export const buyers = pgTable("buyers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= DB FUNCTIONS ================= */

export const orderDb = {
  create: (data: any) =>
    db.insert(orders).values(data).returning(),

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

  listByStore: (storeId: string) =>
    db.query.orders.findMany({
      where: and(eq(orders.storeId, storeId), isNull(orders.deletedAt)),
    }),

  listByBuyer: (buyerId: string) =>
    db.query.orders.findMany({
      where: and(eq(orders.buyerId, buyerId), isNull(orders.deletedAt)),
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

  findBuyer: (email: string, phone: string) =>
    db.query.buyers.findFirst({
      where: and(eq(buyers.email, email), eq(buyers.phone, phone)),
    }),

  findBuyerById: (id: string) =>
    db.query.buyers.findFirst({
      where: eq(buyers.id, id),
    }),

  createBuyer: (data: any) =>
    db.insert(buyers).values(data).returning(),
};
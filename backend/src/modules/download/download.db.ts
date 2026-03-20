import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../config/db";
import { orders } from "../orders/order.db";

export const digitalDownloads = pgTable("digital_downloads", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, {
    onDelete: "cascade",
  }),
  productId: uuid("product_id").notNull(),
  variantId: uuid("variant_id").notNull(),
  token: varchar("token", { length: 128 }).notNull(),
  maxDownloads: integer("max_downloads"),
  downloadCount: integer("download_count").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const downloadLogs = pgTable("download_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  digitalDownloadId: uuid("digital_download_id")
    .notNull()
    .references(() => digitalDownloads.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address", { length: 100 }),
  userAgent: varchar("user_agent", { length: 1024 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const downloadDb = {
  create: (payload: any) =>
    db.insert(digitalDownloads).values(payload).returning(),

  findByToken: (token: string) =>
    db.query.digitalDownloads.findFirst({ where: eq(digitalDownloads.token, token) }),

  findByOrderId: (orderId: string) =>
    db.query.digitalDownloads.findFirst({ where: eq(digitalDownloads.orderId, orderId) }),

  listByProductId: (productId: string) =>
    db.query.digitalDownloads.findMany({ where: eq(digitalDownloads.productId, productId) }),

  listAll: () => db.query.digitalDownloads.findMany(),

  incrementCount: (id: string) =>
    db
      .update(digitalDownloads)
      .set({ downloadCount: sql`download_count + 1` })
      .where(eq(digitalDownloads.id, id)),

  logAccess: (payload: any) => db.insert(downloadLogs).values(payload).returning(),
};

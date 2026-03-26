import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "../../config/db";

export const payoutStatusEnum = pgEnum("payout_status", [
  "LOCKED",
  "ELIGIBLE",
  "RELEASED",
  "CANCELLED",
]);

export const payouts = pgTable("payouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id").notNull(),
  creatorId: varchar("creator_id", { length: 255 }).notNull(),
  orderId: uuid("order_id").notNull().unique(),
  grossAmount: numeric("gross_amount").notNull(),
  commissionAmount: numeric("commission_amount").notNull(),
  netAmount: numeric("net_amount").notNull(),
  status: payoutStatusEnum("status").notNull().default("LOCKED"),
  eligibleAt: timestamp("eligible_at").notNull(),
  releasedAt: timestamp("released_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const payoutDb = {
  create: (data: any) => db.insert(payouts).values(data).returning(),
  findById: (id: string) =>
    db.query.payouts.findFirst({ where: eq(payouts.id, id) }),
  findByOrderId: (orderId: string) =>
    db.query.payouts.findFirst({ where: eq(payouts.orderId, orderId) }),
  listByCreator: (creatorId: string) =>
    db.query.payouts.findMany({ where: eq(payouts.creatorId, creatorId) }),
  listAll: () => db.query.payouts.findMany(),
  update: (id: string, data: any) =>
    db.update(payouts).set({ ...data, updatedAt: new Date() }).where(eq(payouts.id, id)),
  listByStoreAndFilters: (filters: any) => {
    const conds = [] as any[];
    if (filters.storeId) conds.push(eq(payouts.storeId, filters.storeId));
    if (filters.status) conds.push(eq(payouts.status, filters.status));
    if (conds.length) {
      return db.query.payouts.findMany({ where: and(...conds) });
    }
    return db.query.payouts.findMany();
  },
};

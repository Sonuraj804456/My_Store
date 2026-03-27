import { db } from "../../config/db";
import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const adminAuditLogs = pgTable("admin_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: varchar("admin_id", { length: 255 }).notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  entityType: varchar("entity_type", { length: 80 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const adminAuditDb = {
  create: async (data: any) => {
    if (!(db as any).insert) {
      // In tests we may mock db without insert.
      return [];
    }

    return (db as any)
      .insert(adminAuditLogs)
      .values(data)
      .returning();
  },
};

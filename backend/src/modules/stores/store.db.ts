import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const stores = pgTable("stores", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: varchar("user_id", { length: 255 })
    .notNull()
    .unique(), // one store per user

  username: varchar("username", { length: 30 })
    .notNull()
    .unique(), // globally unique & permanent

  name: varchar("name", { length: 80 })
    .notNull(),

  description: varchar("description", { length: 500 }),

  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),

  isPublic: boolean("is_public")
    .notNull()
    .default(false),

  isVacationMode: boolean("is_vacation_mode")
    .notNull()
    .default(false),

  announcementText: varchar("announcement_text", { length: 200 }),
  announcementEnabled: boolean("announcement_enabled")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
// 844cf2d6-1fcd-4085-8201-b11f112912f2
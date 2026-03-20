import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  pgEnum,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { stores } from "../stores/store.db";

/* ================= ENUMS ================= */

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
]);

export const productTypeEnum = pgEnum("product_type", ["PHYSICAL", "DIGITAL"]);

export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "file"]);

/* ================= PRODUCTS ================= */

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),

    productType: productTypeEnum("product_type").notNull().default("PHYSICAL"),

    title: varchar("title", { length: 120 }).notNull(),

    description: text("description"),

    status: productStatusEnum("status")
      .notNull()
      .default("draft"),

    isFeatured: boolean("is_featured")
      .notNull()
      .default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => ({
    storeIdx: index("products_store_idx").on(table.storeId),
    statusIdx: index("products_status_idx").on(table.status),
  })
);

/* ================= CATEGORIES ================= */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 50 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueStoreCategory: uniqueIndex("unique_store_category").on(
      table.storeId,
      table.name
    ),
    storeIdx: index("categories_store_idx").on(table.storeId),
  })
);

/* ================= PRODUCT_CATEGORIES ================= */

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.productId, table.categoryId],
    }),
  })
);

/* ================= VARIANTS ================= */

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 50 }).notNull(),

    price: numeric("price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    inventory: integer("inventory")
      .notNull()
      .default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    productIdx: index("variants_product_idx").on(table.productId),
  })
);

/* ================= MEDIA ================= */

export const productMedia = pgTable(
  "product_media",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    url: text("url").notNull(),

    type: mediaTypeEnum("type").notNull(),

    position: integer("position").notNull(),
  },
  (table) => ({
    productIdx: index("media_product_idx").on(table.productId),

    uniqueProductPosition: uniqueIndex(
      "unique_product_media_position"
    ).on(table.productId, table.position),
  })
);
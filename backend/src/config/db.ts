import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";

// schemas
import { user, merchants, customers, session, account, verification, userRelations, merchantRelations, customerRelations, sessionRelations, accountRelations } from "../modules/auth/auth.schema";
import { stores } from "../modules/stores/store.db";
import { products, categories, productCategories, productVariants, productMedia } from "../modules/products/product.db";
import { orders } from "../modules/orders/order.db";
import { payouts } from "../modules/payout/payout.db";
import { digitalDownloads, downloadLogs } from "../modules/download/download.db";
import { conversations, messages } from "../modules/messages/message.db";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    user,
    merchants,
    customers,
    session,
    account,
    verification,
    userRelations,
    merchantRelations,
    customerRelations,
    sessionRelations,
    accountRelations,
    stores,
    products,
    categories,
    productCategories,
    productVariants,
    productMedia,
    orders,
    payouts,
    digitalDownloads,
    downloadLogs,
    conversations,
    messages,
  },
});
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";

// schemas
import * as authSchema from "../modules/auth/auth.schema";
import * as storeSchema from "../modules/stores/store.db";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...authSchema,
    ...storeSchema,
  },
});

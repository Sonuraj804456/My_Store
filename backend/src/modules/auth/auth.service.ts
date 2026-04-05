import { db } from "../../config/db";
import { user, merchants, customers } from "./auth.schema";
import { Pool } from "pg";
import { eq } from "drizzle-orm";

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export const userService = {
  async createUser(id: string, email: string, name?: string) {
    return await db.insert(user).values({ id, email, name: name || "", });
  },

  async getById(id: string) {
    const client = getPool();
    const result = await client.query("SELECT * FROM \"user\" WHERE id = $1 LIMIT 1", [id]);
    return result.rows[0];
  },

  async getByEmail(email: string) {
    const client = getPool();
    const result = await client.query("SELECT * FROM \"user\" WHERE email = $1 LIMIT 1", [email]);
    return result.rows[0];
  },

  async createMerchant(userId: string) {
    return await db.insert(merchants).values({ userId }).returning();
  },

  async getMerchantByUserId(userId: string) {
    return await db.query.merchants.findFirst({
      where: eq(merchants.userId, userId),
    });
  },

  async createCustomer(email: string, phone: string, name: string, userId?: string) {
    return await db.insert(customers).values({ email, phone, name, userId }).returning();
  },

  async getCustomerByEmailAndPhone(email: string, phone: string) {
    return await db.query.customers.findFirst({
      where: (cust) => eq(cust.email, email) && eq(cust.phone, phone),
    });
  },
};

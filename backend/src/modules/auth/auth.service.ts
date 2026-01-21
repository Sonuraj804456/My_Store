import { db } from "../../config/db";
import { user } from "./auth.schema";
import { Pool } from "pg";

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
};

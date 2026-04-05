import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../config/db";
import { env } from "../../config/env";
import * as schema from "./auth.schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  // 🔐 COOKIE CONFIG (THIS WAS MISSING)
  cookies: {
    session: {
      name: "better-auth.session",
      options: {
        httpOnly: true,
        sameSite: "lax",   // ✅ REQUIRED for localhost cross-port
        secure: false,     // ✅ MUST be false on localhost
        path: "/",
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL ?? "http://localhost:3000",
});

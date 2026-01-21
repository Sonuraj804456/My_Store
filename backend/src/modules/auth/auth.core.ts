import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../config/db";
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

  callbacks: {
    //@ts-ignore
    jwt: async ({ token, user }) => {
      token.role = user?.role ?? "CREATOR"; // default fallback
      return token;
    },
    //@ts-ignore
    session: async ({ session, token }) => {
      session.user.role = token.role;
      return session;
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

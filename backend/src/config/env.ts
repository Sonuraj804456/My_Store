import { z } from "zod";
import dotenv from "dotenv";
import path from "node:path";
import { existsSync } from "node:fs";

const rootEnv = path.resolve(__dirname, "../../.env");
const testEnv = path.resolve(__dirname, "../../.env.test");

if (process.env.NODE_ENV === "test") {
  if (existsSync(testEnv)) {
    dotenv.config({ path: testEnv });
  } else if (existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
  }
} else {
  if (existsSync(rootEnv)) {
    dotenv.config({ path: rootEnv });
  }
}

export const envSchema = z
  .object({
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url().optional(),
    ADMIN_EMAIL: z.string().email().optional(),
    ADMIN_PASSWORD: z.string().min(1).optional(),
    PORT: z.string().transform(Number),
    NODE_ENV: z.enum(["development", "production", "test"]),
    PLATFORM_COMMISSION_PERCENT: z.string().optional(),
    PAYOUT_HOLD_DAYS: z.string().optional(),
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // 🚨 Only exit if NOT in test mode
  if (process.env.NODE_ENV !== "test") {
    console.error(parsed.error.format());
    process.exit(1);
  }
}

export const env = parsed.success
  ? {
      ...parsed.data,
      BETTER_AUTH_SECRET: parsed.data.BETTER_AUTH_SECRET,
    }
  : {
      DATABASE_URL:
        process.env.NODE_ENV === "test"
          ? "postgres://postgres:postgres@127.0.0.1:5432/my_store_test"
          : "postgres://postgres:postgres@127.0.0.1:5432/my_store",
      BETTER_AUTH_SECRET: "test",
      BETTER_AUTH_URL: "http://localhost:3000",
      ADMIN_EMAIL: undefined,
      ADMIN_PASSWORD: undefined,
      PLATFORM_COMMISSION_PERCENT: "10",
      PAYOUT_HOLD_DAYS: "7",
      PORT: 3000,
      NODE_ENV: "test" as const,
    };

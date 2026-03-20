import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTERAUTH_SECRET: z.string().min(1),
  PORT: z.string().transform(Number),
  NODE_ENV: z.enum(["development", "production", "test"])
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
  ? parsed.data
  : {
      DATABASE_URL:
        process.env.NODE_ENV === "test"
          ? "postgres://postgres:postgres@127.0.0.1:5432/my_store_test"
          : "postgres://postgres:postgres@127.0.0.1:5432/my_store",
      BETTERAUTH_SECRET: "test",
      PORT: 3000,
      NODE_ENV: "test" as const,
    };

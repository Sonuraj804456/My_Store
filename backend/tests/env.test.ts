import { describe, it, expect } from "vitest";
import { envSchema } from "../src/config/env";

describe("Env validation", () => {
  it("should validate correct env vars", () => {
    const mock = {
      DATABASE_URL: "postgres://db",
      BETTER_AUTH_SECRET: "secret123",
      PORT: "3000",
      NODE_ENV: "development",
      PLATFORM_COMMISSION_PERCENT: "10",
      PAYOUT_HOLD_DAYS: "7",
    };

    const result = envSchema.safeParse(mock);
    expect(result.success).toBe(true);
  });

  it("should fail on missing env vars", () => {
    const mock = {
      DATABASE_URL: undefined,
      BETTER_AUTH_SECRET: undefined,
      PORT: undefined,
      NODE_ENV: undefined,
    };

    const result = envSchema.safeParse(mock);
    expect(result.success).toBe(false);
  });
});

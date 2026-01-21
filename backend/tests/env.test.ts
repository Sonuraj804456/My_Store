import { describe, it, expect } from "vitest";
import { envSchema } from "../src/config/env";

describe("Env validation", () => {
  it("should validate correct env vars", () => {
    const mock = {
      DATABASE_URL: "postgres://db",
      BETTERAUTH_SECRET: "secret123",
      PORT: "3000",
      NODE_ENV: "development",
    };

    const result = envSchema.safeParse(mock);
    expect(result.success).toBe(true);
  });

  it("should fail on missing env vars", () => {
    const mock = {
      DATABASE_URL: undefined,
      BETTERAUTH_SECRET: undefined,
      PORT: undefined,
      NODE_ENV: undefined,
    };

    const result = envSchema.safeParse(mock);
    expect(result.success).toBe(false);
  });
});

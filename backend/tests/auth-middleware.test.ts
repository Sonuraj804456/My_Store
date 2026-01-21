import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { requireAuth } from "../src/modules/auth/auth.middleware";

// ---- MOCK EXTERNALS ----
vi.mock("../src/modules/auth/auth.core", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock("../src/config/db", () => ({
  db: {
    query: {
      session: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    },
  },
}));

// ---- MOCK UTILS ----
function mockReq(data?: Partial<Request>): Request {
  return {
    headers: {},
    ...data,
  } as Request;
}

function mockRes(): Response & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as any;
}

function mockNext(): NextFunction {
  return vi.fn();
}

// ---- TESTS ----
describe("Auth middleware", () => {
  it("should block unauthorized requests", async () => {
    const req = mockReq(); // no user, no headers
    const res = mockRes();
    const next = mockNext();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should allow requests when BetterAuth returns a user", async () => {
    // Override mock for this test only
    const { auth } = await import("../src/modules/auth/auth.core");
    (auth.api.getSession as any) = vi.fn().mockResolvedValue({
  user: { id: "1", email: "test@example.com", role: "CREATOR" },
});


    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should allow requests with valid Bearer token", async () => {
    const req = mockReq({
      headers: { authorization: "Bearer VALID" },
    });

    // Override DB mock
    const { db } = await import("../src/config/db");
    db.query.session.findFirst = vi.fn().mockResolvedValue({
      user: { id: "123", email: "buyer@example.com", role: "BUYER" },
    });

    const res = mockRes();
    const next = mockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

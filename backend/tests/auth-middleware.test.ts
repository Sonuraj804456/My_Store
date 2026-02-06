import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";

let requireAuth: any;

// ---- MOCK EXTERNALS ----
vi.mock("../src/modules/auth/auth.core", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("../src/config/db", () => ({
  db: {
    query: {
      session: {
        findFirst: vi.fn(),
      },
    },
  },
}));

let auth: any;
let db: any;

// ---- HELPERS ----
function mockReq(headers: Record<string, string> = {}): Request {
  return {
    headers,
    get: (name: string) => headers[name.toLowerCase()],
  } as unknown as Request;
}

function mockRes(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
}

function mockNext(): NextFunction {
  return vi.fn();
}

beforeEach(async () => {
  vi.clearAllMocks();
  const mod = await import("../src/modules/auth/auth.core");
  auth = (mod as any).auth;
  const modDb = await import("../src/config/db");
  db = (modDb as any).db;
  const modReq = await import("../src/modules/auth/auth.middleware");
  requireAuth = (modReq as any).requireAuth;
});

// ---- TESTS ----
describe("Auth middleware", () => {
  it("blocks unauthorized requests", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("allows requests when BetterAuth returns a user", async () => {
    (auth.api.getSession as any).mockResolvedValue({
      user: { id: "1", email: "test@example.com", role: "CREATOR" },
    });

    const req = mockReq();
    const res = mockRes();
    const next = mockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("allows requests with valid Bearer token", async () => {
    (auth.api.getSession as any).mockResolvedValue(null);

    (db.query.session.findFirst as any).mockResolvedValue({
      user: { id: "123", email: "buyer@example.com", role: "BUYER" },
    });

    const req = mockReq({ authorization: "Bearer VALID" });
    const res = mockRes();
    const next = mockNext();

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});

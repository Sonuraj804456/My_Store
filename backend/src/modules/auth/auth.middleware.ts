import { Request, Response, NextFunction } from "express";
import { db } from "../../config/db";
import { session, merchants } from "./auth.schema";
import { eq } from "drizzle-orm";
import { failure } from "../shared/response";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader =
  typeof req.get === "function"
    ? req.get("authorization")
    : req.headers?.authorization;

    // If no Authorization header, try BetterAuth session (e.g., cookie/session)
    if (!authHeader) {
      try {
        const authModule = await import("./auth.core");
        const auth = (authModule as any).auth;
        if (auth && auth.api && typeof auth.api.getSession === "function") {
          const betterSession = await auth.api.getSession(req as any).catch(() => null);
          if (betterSession && betterSession.user) {
            req.user = {
              id: betterSession.user.id,
              email: betterSession.user.email,
            };
            return next();
          }
        }
      } catch (e) {
        // ignore import/mock errors and fall through to unauthorized
      }

      return res.status(401).json(failure({ message: "Unauthorized" }));
    }

  const token = authHeader.replace("Bearer ", "");

  const sessionRecord = await db.query.session.findFirst({
    where: eq(session.token, token),
    with: { user: true },
  });

  if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
    return res.status(401).json(failure({ message: "Invalid or expired token" }));
  }

  // Attach user with identity info only
  req.user = {
    id: sessionRecord.user.id,
    email: sessionRecord.user.email,
  };

  next();
}

/**
 * Middleware to check if authenticated user is a merchant (store owner)
 */
export async function requireMerchant(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json(failure({ message: "Unauthorized" }));
  }

  const merchant = await db.query.merchants.findFirst({
    where: eq(merchants.userId, req.user.id),
  });

  if (!merchant) {
    return res.status(403).json(failure({ message: "User is not a merchant" }));
  }

  // Attach merchant info to request
  (req as any).merchant = merchant;
  next();
}

/**
 * Middleware to check if authenticated user is an admin
 * Admins are controlled via ENV variable
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json(failure({ message: "Unauthorized" }));
  }

  const adminIds = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);

  if (!adminIds.includes(req.user.id)) {
    return res.status(403).json(failure({ message: "Admin access required" }));
  }

  next();
}

import { Request, Response, NextFunction } from "express";
import { db } from "../../config/db";
import { session } from "./auth.schema";
import { eq } from "drizzle-orm";
import { Roles } from "../types/roles";


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
              role: betterSession.user.role as Roles,
              email: betterSession.user.email,
            };
            return next();
          }
        }
      } catch (e) {
        // ignore import/mock errors and fall through to unauthorized
      }

      return res.status(401).json({ error: "Unauthorized" });
    }

  const token = authHeader.replace("Bearer ", "");

  const sessionRecord = await db.query.session.findFirst({
    where: eq(session.token, token),
    with: { user: true },
  });

  if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // 🔑 IMPORTANT: attach ONLY what the app needs
  req.user = {
    id: sessionRecord.user.id,       // must match stores.userId
    role: sessionRecord.user.role as Roles,
    email: sessionRecord.user.email,
  };

  next();
}

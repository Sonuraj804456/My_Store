import { auth } from "./auth.core";
import { Request, Response, NextFunction } from "express";
import { db } from "../../config/db";
import { session, user } from "./auth.schema";
import { eq, and, gt } from "drizzle-orm";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Try to get session from BetterAuth first
  const sessionFromAuth = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });

  if (sessionFromAuth?.user) {
    (req as any).user = sessionFromAuth.user;
    return next();
  }

  // If no BetterAuth session, try Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    
    try {
      // Query the session from database
      const sessionRecord = await db.query.session.findFirst({
        where: and(
          eq(session.token, token),
          gt(session.expiresAt, new Date())
        ),
        with: {
          user: true,
        },
      });

      if (sessionRecord?.user) {
        (req as any).user = sessionRecord.user;
        return next();
      }
    } catch (error) {
      console.error("Session validation error:", error);
    }
  }

  return res.status(401).json({ error: "Unauthorized" });
}

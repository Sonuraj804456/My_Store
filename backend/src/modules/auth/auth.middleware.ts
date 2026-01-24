import { Request, Response, NextFunction } from "express";
import { db } from "../../config/db";
import { session } from "./auth.schema";
import { eq, gt } from "drizzle-orm";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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

  (req as any).user = sessionRecord.user;
  next();
}

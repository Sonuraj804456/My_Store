import { Roles } from "./auth.roles";
import { Request, Response, NextFunction } from "express";

export function requireRole(role: Roles) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if ((req as any).user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}

import { Request, Response, NextFunction } from "express";
import { Roles } from "../types/roles";
import { failure } from "../shared/response";

export function requireRole(role: Roles | Roles) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json(failure({ message: "Unauthorized" }));

    // Log roles for debugging (will appear in server logs)
    console.info("[requireRole] user role:", String((req as any).user.role), "required:", String(role));

    if (String((req as any).user.role) !== String(role)) {
      console.warn("[requireRole] role mismatch - access denied");
      return res.status(403).json(failure({ message: "Forbidden" }));
    }

    next();
  };
}

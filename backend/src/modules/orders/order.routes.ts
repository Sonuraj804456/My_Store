import { Router } from "express";
import { orderController } from "./order.controller";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";
import { requireAuth } from "../auth/auth.middleware";
import { ipRateLimiter } from "../shared/rate-limit";

const router: Router = Router();

/* ================= PUBLIC ================= */

router.post("/orders", ipRateLimiter, orderController.create);

/* ================= BUYER ================= */

router.get(
  "/my-orders",
  requireAuth,
  requireRole(Roles.BUYER),
  orderController.listForBuyer
);

/* ================= CREATOR ================= */

router.get(
  "/orders",
  requireAuth,                  // ✅ authenticate first
  requireRole(Roles.CREATOR),   // ✅ then check role
  orderController.list
);

router.patch(
  "/orders/:id/status",
  requireAuth,
  requireRole(Roles.CREATOR),
  orderController.updateStatusCreator
);

router.patch(
  "/orders/:id/refund",
  requireAuth,
  requireRole(Roles.CREATOR),
  orderController.markRefund
);

/* ================= ADMIN ================= */

router.get(
  "/admin/orders",
  requireAuth,
  requireRole(Roles.ADMIN),
  orderController.listAll
);

router.patch(
  "/admin/orders/:id/status",
  requireAuth,
  requireRole(Roles.ADMIN),
  orderController.updateStatusAdmin
);

router.delete(
  "/admin/orders/:id",
  requireAuth,
  requireRole(Roles.ADMIN),
  orderController.softDelete
);

export default router;
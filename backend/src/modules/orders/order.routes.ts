import { Router } from "express";
import { orderController } from "./order.controller";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";
import { requireAuth } from "../auth/auth.middleware";
import { ipRateLimiter } from "../shared/rate-limit";
import { validateBody } from "../shared/validate-body";
import {
  createOrderSchema,
  updateStatusSchema,
  refundSchema,
} from "./order.schema";

const router: Router = Router();

/* ================= PUBLIC ================= */

router.post(
  "/orders",
  ipRateLimiter,
  validateBody(createOrderSchema),
  orderController.create
);

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
  requireAuth,
  requireRole(Roles.CREATOR),
  orderController.list
);

router.get(
  "/orders/:id",
  requireAuth,
  requireRole(Roles.CREATOR),
  orderController.getById
);

router.patch(
  "/orders/:id/status",
  requireAuth,
  requireRole(Roles.CREATOR),
  validateBody(updateStatusSchema),
  orderController.updateStatusCreator
);

router.patch(
  "/orders/:id/refund",
  requireAuth,
  requireRole(Roles.CREATOR),
  validateBody(refundSchema),
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
  validateBody(updateStatusSchema),
  orderController.updateStatusAdmin
);

router.delete(
  "/admin/orders/:id",
  requireAuth,
  requireRole(Roles.ADMIN),
  orderController.softDelete
);

export default router;
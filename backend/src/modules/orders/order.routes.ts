import { Router } from "express";
import { orderController } from "./order.controller";
import { requireAuth, requireMerchant, requireAdmin } from "../auth/auth.middleware";
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

/* ================= MERCHANT (store owners) ================= */

router.get(
  "/orders",
  requireAuth,
  requireMerchant,
  orderController.list
);

router.get(
  "/orders/:id",
  requireAuth,
  requireMerchant,
  orderController.getById
);

router.patch(
  "/orders/:id/status",
  requireAuth,
  requireMerchant,
  validateBody(updateStatusSchema),
  orderController.updateStatusCreator
);

router.patch(
  "/orders/:id/refund",
  requireAuth,
  requireMerchant,
  validateBody(refundSchema),
  orderController.markRefund
);

/* ================= ADMIN ================= */

router.get(
  "/admin/orders",
  requireAuth,
  requireAdmin,
  orderController.listAll
);

router.patch(
  "/admin/orders/:id/status",
  requireAuth,
  requireAdmin,
  validateBody(updateStatusSchema),
  orderController.updateStatusAdmin
);

router.delete(
  "/admin/orders/:id",
  requireAuth,
  requireAdmin,
  orderController.softDelete
);

export default router;
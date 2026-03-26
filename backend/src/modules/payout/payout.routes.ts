import { Router } from "express";
import * as payoutController from "./payout.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";

const router: Router = Router();

router.use(requireAuth);

router.get("/payouts", requireRole(Roles.CREATOR), payoutController.listPayouts);
router.get("/payouts/summary", requireRole(Roles.CREATOR), payoutController.getSummary);

router.get("/admin/payouts", requireRole(Roles.ADMIN), payoutController.adminListPayouts);
router.patch("/admin/payouts/:id/release", requireRole(Roles.ADMIN), payoutController.adminReleasePayout);
router.patch("/admin/payouts/:id/cancel", requireRole(Roles.ADMIN), payoutController.adminCancelPayout);

export default router;

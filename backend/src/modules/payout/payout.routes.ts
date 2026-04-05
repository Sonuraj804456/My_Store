import { Router } from "express";
import * as payoutController from "./payout.controller";
import { requireAuth, requireMerchant, requireAdmin } from "../auth/auth.middleware";

const router: Router = Router();

router.use(requireAuth);

router.get("/payouts", requireMerchant, payoutController.listPayouts);
router.get("/payouts/summary", requireMerchant, payoutController.getSummary);

router.get("/admin/payouts", requireAdmin, payoutController.adminListPayouts);
router.patch("/admin/payouts/:id/release", requireAdmin, payoutController.adminReleasePayout);
router.patch("/admin/payouts/:id/cancel", requireAdmin, payoutController.adminCancelPayout);
router.patch("/admin/payouts/:id/freeze", requireAdmin, payoutController.adminFreezePayout);
router.patch("/admin/payouts/:id/unfreeze", requireAdmin, payoutController.adminUnfreezePayout);

export default router;

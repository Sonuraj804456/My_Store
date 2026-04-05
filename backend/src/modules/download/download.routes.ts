import { Router } from "express";
import { downloadController } from "./download.controller";
import { requireAuth, requireMerchant, requireAdmin } from "../auth/auth.middleware";

const router: Router = Router();

// public secure link
router.get("/download/:token", downloadController.publicDownload);

// customer/merchant/admin token introspection
router.get(
  "/token/:orderId",
  requireAuth,
  downloadController.getTokenByOrder
);

// merchant-only introspection (for their product downloads)
router.get(
  "/products/:id/downloads",
  requireAuth,
  requireMerchant,
  downloadController.creatorList
);

// admin listing
router.get(
  "/admin/downloads",
  requireAuth,
  requireAdmin,
  downloadController.adminList
);

export default router;

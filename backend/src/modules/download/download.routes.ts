import { Router } from "express";
import { downloadController } from "./download.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";

const router: Router = Router();

// public secure link
router.get("/download/:token", downloadController.publicDownload);

// buyer/creator/admin token introspection
router.get(
  "/token/:orderId",
  requireAuth,
  downloadController.getTokenByOrder
);

// creator-only introspection

router.get(
  "/products/:id/downloads",
  requireAuth,
  requireRole(Roles.CREATOR),
  downloadController.creatorList
);

// admin listing
router.get(
  "/admin/downloads",
  requireAuth,
  requireRole(Roles.ADMIN),
  downloadController.adminList
);

export default router;

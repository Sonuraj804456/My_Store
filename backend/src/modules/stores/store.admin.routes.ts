import { Router } from "express";
import * as controller from "./store.controller";
import { validateBody } from "../shared/validate-body";
import { suspendStoreSchema } from "./store.schema";
import { requireAuth, requireAdmin } from "../auth/auth.middleware";

const router: Router = Router();

router.use(requireAuth, requireAdmin);

// GET /v1/api/admin/stores
router.get("/stores", controller.adminListStores);

// GET /v1/api/admin/stores/:id
router.get("/stores/:id", controller.adminGetStoreById);

// PATCH /v1/api/admin/stores/:id/suspend
router.patch(
  "/stores/:id/suspend",
  validateBody(suspendStoreSchema),
  controller.adminSuspendStore
);

// PATCH /v1/api/admin/stores/:id/unsuspend
router.patch("/stores/:id/unsuspend", controller.adminUnsuspendStore);

// PATCH /v1/api/admin/stores/:id/restore
router.patch("/stores/:id/restore", controller.adminRestoreStore);

export default router;

import { Router } from "express";
import * as controller from "./store.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";

const router: Router = Router();

router.use(requireAuth, requireRole(Roles.ADMIN));

// GET /v1/api/admin/stores
router.get("/stores", controller.adminListStores);

// GET /v1/api/admin/stores/:id
router.get("/stores/:id", controller.adminGetStoreById);

// PATCH /v1/api/admin/stores/:id/restore
router.patch("/stores/:id/restore", controller.adminRestoreStore);

export default router;

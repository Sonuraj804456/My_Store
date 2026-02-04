import { Router } from "express";
import * as controller from "./store.controller";

import {
  createStoreSchema,
  updateStoreSchema,
} from "./store.schema";

import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../auth/requireRole";


import { Roles } from "../types/roles";
import { validateBody } from "../shared/validate-body";


const router: Router = Router();

/* ======================================
   ADMIN ROUTES
====================================== */


router.get(
  "/admin",
  requireAuth,
  requireRole(Roles.ADMIN),
  controller.adminListStores
);

router.get(
  "/admin/:id",
  requireAuth,
  requireRole(Roles.ADMIN),
  controller.adminGetStoreById
);

router.patch(
  "/admin/:id/restore",
  requireAuth,
  requireRole(Roles.ADMIN),
  controller.adminRestoreStore
);

/* ======================================
   CREATOR ROUTES
====================================== */

router.post(
  "/",
  requireAuth,
  requireRole(Roles.CREATOR),
  validateBody(createStoreSchema),
  controller.createStore
);

router.get(
  "/me",
  requireAuth,
  requireRole(Roles.CREATOR),
  controller.getOwnStore
);

router.patch(
  "/me",
  requireAuth,
  requireRole(Roles.CREATOR),
  validateBody(updateStoreSchema),
  controller.updateOwnStore
);

router.delete(
  "/me",
  requireAuth,
  requireRole(Roles.CREATOR),
  controller.deleteOwnStore
);

/* ======================================
   PUBLIC ROUTES
====================================== */

router.get(
  "/:username",
  controller.getPublicStore
);


export default router;

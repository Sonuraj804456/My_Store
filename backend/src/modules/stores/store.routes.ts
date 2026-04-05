import { Router } from "express";
import * as controller from "./store.controller";

import {
  createStoreSchema,
  updateStoreSchema,
} from "./store.schema";

import { requireAuth, requireMerchant } from "../auth/auth.middleware";
import { validateBody } from "../shared/validate-body";


const router: Router = Router();

/* ======================================
   MERCHANT ROUTES (store owners)
====================================== */

router.post(
  "/",
  requireAuth,
  requireMerchant,
  validateBody(createStoreSchema),
  controller.createStore
);

router.get(
  "/me",
  requireAuth,
  requireMerchant,
  controller.getOwnStore
);

router.patch(
  "/me",
  requireAuth,
  requireMerchant,
  validateBody(updateStoreSchema),
  controller.updateOwnStore
);

router.delete(
  "/me",
  requireAuth,
  requireMerchant,
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

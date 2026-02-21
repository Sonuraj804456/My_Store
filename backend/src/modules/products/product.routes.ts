import { Router } from "express";
import * as controller from "./product.controller";
import { requireAuth } from "../auth/auth.middleware";
import { requireRole } from "../auth/requireRole";
import { Roles } from "../types/roles";

const router: Router = Router();

/* ======================================================
   PUBLIC ROUTES  ✅ MUST COME FIRST
====================================================== */

router.get(
  "/public/:username",
  controller.listPublishedByStore
);

router.get(
  "/public/:username/:productId",
  controller.getSinglePublishedProduct
);

/* ======================================================
   CREATOR ROUTES (Protected)
====================================================== */

router.use(requireAuth);
router.use(requireRole(Roles.CREATOR));

/* Categories */
router.post("/categories", controller.createCategory);
router.get("/categories", controller.listCategories);

/* Products */
router.post("/", controller.createProduct);
router.get("/", controller.getOwnProducts);
router.get("/:id", controller.getSingleProduct);
router.patch("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

/* Variants */
router.post("/:id/variants", controller.addVariant);
router.patch("/:id/variants/:variantId", controller.updateVariant);
router.delete("/:id/variants/:variantId", controller.deleteVariant);

/* Media */
router.post("/:id/media", controller.addMedia);
router.delete("/:id/media/:mediaId", controller.removeMedia);

export default router;
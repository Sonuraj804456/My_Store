import { Router } from "express";
import * as controller from "./product.controller";
import { requireAuth, requireMerchant } from "../auth/auth.middleware";
import { validateBody } from "../shared/validate-body";
import {
  createProductSchema,
  updateProductSchema,
  createCategorySchema,
  createVariantSchema,
  updateVariantSchema,
  createMediaSchema,
} from "./product.schema";

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
router.use(requireMerchant);

/* Categories */
router.post(
  "/categories",
  validateBody(createCategorySchema),
  controller.createCategory
);
router.get("/categories", controller.listCategories);

/* Products */
router.post(
  "/",
  validateBody(createProductSchema),
  controller.createProduct
);
router.get("/", controller.getOwnProducts);
router.get("/:id", controller.getSingleProduct);
router.patch(
  "/:id",
  validateBody(updateProductSchema),
  controller.updateProduct
);
router.delete("/:id", controller.deleteProduct);

/* Variants */
router.post(
  "/:id/variants",
  validateBody(createVariantSchema),
  controller.addVariant
);
router.patch(
  "/:id/variants/:variantId",
  validateBody(updateVariantSchema),
  controller.updateVariant
);
router.delete("/:id/variants/:variantId", controller.deleteVariant);

/* Media */
router.post(
  "/:id/media",
  validateBody(createMediaSchema),
  controller.addMedia
);
router.delete("/:id/media/:mediaId", controller.removeMedia);

export default router;
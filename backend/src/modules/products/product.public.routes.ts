import { Router } from "express";
import * as controller from "./product.controller";

const router: Router = Router();

router.get(
  "/stores/:username/products",
  controller.listPublishedByStore
);

router.get(
  "/stores/:username/products/:productId",
  controller.getSinglePublishedProduct
);

export default router;
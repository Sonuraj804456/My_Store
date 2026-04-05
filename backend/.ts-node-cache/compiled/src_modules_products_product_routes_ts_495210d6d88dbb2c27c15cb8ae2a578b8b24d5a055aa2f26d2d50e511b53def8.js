"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("./product.controller"));
const auth_middleware_1 = require("../auth/auth.middleware");
const validate_body_1 = require("../shared/validate-body");
const product_schema_1 = require("./product.schema");
const router = (0, express_1.Router)();
/* ======================================================
   PUBLIC ROUTES  ✅ MUST COME FIRST
====================================================== */
router.get("/public/:username", controller.listPublishedByStore);
router.get("/public/:username/:productId", controller.getSinglePublishedProduct);
/* ======================================================
   CREATOR ROUTES (Protected)
====================================================== */
router.use(auth_middleware_1.requireAuth);
router.use(auth_middleware_1.requireMerchant);
/* Categories */
router.post("/categories", (0, validate_body_1.validateBody)(product_schema_1.createCategorySchema), controller.createCategory);
router.get("/categories", controller.listCategories);
/* Products */
router.post("/", (0, validate_body_1.validateBody)(product_schema_1.createProductSchema), controller.createProduct);
router.get("/", controller.getOwnProducts);
router.get("/:id", controller.getSingleProduct);
router.patch("/:id", (0, validate_body_1.validateBody)(product_schema_1.updateProductSchema), controller.updateProduct);
router.delete("/:id", controller.deleteProduct);
/* Variants */
router.post("/:id/variants", (0, validate_body_1.validateBody)(product_schema_1.createVariantSchema), controller.addVariant);
router.patch("/:id/variants/:variantId", (0, validate_body_1.validateBody)(product_schema_1.updateVariantSchema), controller.updateVariant);
router.delete("/:id/variants/:variantId", controller.deleteVariant);
/* Media */
router.post("/:id/media", (0, validate_body_1.validateBody)(product_schema_1.createMediaSchema), controller.addMedia);
router.delete("/:id/media/:mediaId", controller.removeMedia);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9wcm9kdWN0cy9wcm9kdWN0LnJvdXRlcy50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9wcm9kdWN0cy9wcm9kdWN0LnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFpQztBQUNqQyxpRUFBbUQ7QUFDbkQsNkRBQXVFO0FBQ3ZFLDJEQUF1RDtBQUN2RCxxREFPMEI7QUFFMUIsTUFBTSxNQUFNLEdBQVcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFaEM7O3lEQUV5RDtBQUV6RCxNQUFNLENBQUMsR0FBRyxDQUNSLG1CQUFtQixFQUNuQixVQUFVLENBQUMsb0JBQW9CLENBQ2hDLENBQUM7QUFFRixNQUFNLENBQUMsR0FBRyxDQUNSLDhCQUE4QixFQUM5QixVQUFVLENBQUMseUJBQXlCLENBQ3JDLENBQUM7QUFFRjs7eURBRXlEO0FBRXpELE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQVcsQ0FBQyxDQUFDO0FBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWUsQ0FBQyxDQUFDO0FBRTVCLGdCQUFnQjtBQUNoQixNQUFNLENBQUMsSUFBSSxDQUNULGFBQWEsRUFDYixJQUFBLDRCQUFZLEVBQUMscUNBQW9CLENBQUMsRUFDbEMsVUFBVSxDQUFDLGNBQWMsQ0FDMUIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUVyRCxjQUFjO0FBQ2QsTUFBTSxDQUFDLElBQUksQ0FDVCxHQUFHLEVBQ0gsSUFBQSw0QkFBWSxFQUFDLG9DQUFtQixDQUFDLEVBQ2pDLFVBQVUsQ0FBQyxhQUFhLENBQ3pCLENBQUM7QUFDRixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDaEQsTUFBTSxDQUFDLEtBQUssQ0FDVixNQUFNLEVBQ04sSUFBQSw0QkFBWSxFQUFDLG9DQUFtQixDQUFDLEVBQ2pDLFVBQVUsQ0FBQyxhQUFhLENBQ3pCLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFaEQsY0FBYztBQUNkLE1BQU0sQ0FBQyxJQUFJLENBQ1QsZUFBZSxFQUNmLElBQUEsNEJBQVksRUFBQyxvQ0FBbUIsQ0FBQyxFQUNqQyxVQUFVLENBQUMsVUFBVSxDQUN0QixDQUFDO0FBQ0YsTUFBTSxDQUFDLEtBQUssQ0FDViwwQkFBMEIsRUFDMUIsSUFBQSw0QkFBWSxFQUFDLG9DQUFtQixDQUFDLEVBQ2pDLFVBQVUsQ0FBQyxhQUFhLENBQ3pCLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVwRSxXQUFXO0FBQ1gsTUFBTSxDQUFDLElBQUksQ0FDVCxZQUFZLEVBQ1osSUFBQSw0QkFBWSxFQUFDLGtDQUFpQixDQUFDLEVBQy9CLFVBQVUsQ0FBQyxRQUFRLENBQ3BCLENBQUM7QUFDRixNQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUU3RCxrQkFBZSxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0ICogYXMgY29udHJvbGxlciBmcm9tIFwiLi9wcm9kdWN0LmNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IHJlcXVpcmVBdXRoLCByZXF1aXJlTWVyY2hhbnQgfSBmcm9tIFwiLi4vYXV0aC9hdXRoLm1pZGRsZXdhcmVcIjtcbmltcG9ydCB7IHZhbGlkYXRlQm9keSB9IGZyb20gXCIuLi9zaGFyZWQvdmFsaWRhdGUtYm9keVwiO1xuaW1wb3J0IHtcbiAgY3JlYXRlUHJvZHVjdFNjaGVtYSxcbiAgdXBkYXRlUHJvZHVjdFNjaGVtYSxcbiAgY3JlYXRlQ2F0ZWdvcnlTY2hlbWEsXG4gIGNyZWF0ZVZhcmlhbnRTY2hlbWEsXG4gIHVwZGF0ZVZhcmlhbnRTY2hlbWEsXG4gIGNyZWF0ZU1lZGlhU2NoZW1hLFxufSBmcm9tIFwiLi9wcm9kdWN0LnNjaGVtYVwiO1xuXG5jb25zdCByb3V0ZXI6IFJvdXRlciA9IFJvdXRlcigpO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIFBVQkxJQyBST1VURVMgIOKchSBNVVNUIENPTUUgRklSU1Rcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5yb3V0ZXIuZ2V0KFxuICBcIi9wdWJsaWMvOnVzZXJuYW1lXCIsXG4gIGNvbnRyb2xsZXIubGlzdFB1Ymxpc2hlZEJ5U3RvcmVcbik7XG5cbnJvdXRlci5nZXQoXG4gIFwiL3B1YmxpYy86dXNlcm5hbWUvOnByb2R1Y3RJZFwiLFxuICBjb250cm9sbGVyLmdldFNpbmdsZVB1Ymxpc2hlZFByb2R1Y3Rcbik7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgQ1JFQVRPUiBST1VURVMgKFByb3RlY3RlZClcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5yb3V0ZXIudXNlKHJlcXVpcmVBdXRoKTtcbnJvdXRlci51c2UocmVxdWlyZU1lcmNoYW50KTtcblxuLyogQ2F0ZWdvcmllcyAqL1xucm91dGVyLnBvc3QoXG4gIFwiL2NhdGVnb3JpZXNcIixcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZUNhdGVnb3J5U2NoZW1hKSxcbiAgY29udHJvbGxlci5jcmVhdGVDYXRlZ29yeVxuKTtcbnJvdXRlci5nZXQoXCIvY2F0ZWdvcmllc1wiLCBjb250cm9sbGVyLmxpc3RDYXRlZ29yaWVzKTtcblxuLyogUHJvZHVjdHMgKi9cbnJvdXRlci5wb3N0KFxuICBcIi9cIixcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZVByb2R1Y3RTY2hlbWEpLFxuICBjb250cm9sbGVyLmNyZWF0ZVByb2R1Y3Rcbik7XG5yb3V0ZXIuZ2V0KFwiL1wiLCBjb250cm9sbGVyLmdldE93blByb2R1Y3RzKTtcbnJvdXRlci5nZXQoXCIvOmlkXCIsIGNvbnRyb2xsZXIuZ2V0U2luZ2xlUHJvZHVjdCk7XG5yb3V0ZXIucGF0Y2goXG4gIFwiLzppZFwiLFxuICB2YWxpZGF0ZUJvZHkodXBkYXRlUHJvZHVjdFNjaGVtYSksXG4gIGNvbnRyb2xsZXIudXBkYXRlUHJvZHVjdFxuKTtcbnJvdXRlci5kZWxldGUoXCIvOmlkXCIsIGNvbnRyb2xsZXIuZGVsZXRlUHJvZHVjdCk7XG5cbi8qIFZhcmlhbnRzICovXG5yb3V0ZXIucG9zdChcbiAgXCIvOmlkL3ZhcmlhbnRzXCIsXG4gIHZhbGlkYXRlQm9keShjcmVhdGVWYXJpYW50U2NoZW1hKSxcbiAgY29udHJvbGxlci5hZGRWYXJpYW50XG4pO1xucm91dGVyLnBhdGNoKFxuICBcIi86aWQvdmFyaWFudHMvOnZhcmlhbnRJZFwiLFxuICB2YWxpZGF0ZUJvZHkodXBkYXRlVmFyaWFudFNjaGVtYSksXG4gIGNvbnRyb2xsZXIudXBkYXRlVmFyaWFudFxuKTtcbnJvdXRlci5kZWxldGUoXCIvOmlkL3ZhcmlhbnRzLzp2YXJpYW50SWRcIiwgY29udHJvbGxlci5kZWxldGVWYXJpYW50KTtcblxuLyogTWVkaWEgKi9cbnJvdXRlci5wb3N0KFxuICBcIi86aWQvbWVkaWFcIixcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZU1lZGlhU2NoZW1hKSxcbiAgY29udHJvbGxlci5hZGRNZWRpYVxuKTtcbnJvdXRlci5kZWxldGUoXCIvOmlkL21lZGlhLzptZWRpYUlkXCIsIGNvbnRyb2xsZXIucmVtb3ZlTWVkaWEpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7Il19
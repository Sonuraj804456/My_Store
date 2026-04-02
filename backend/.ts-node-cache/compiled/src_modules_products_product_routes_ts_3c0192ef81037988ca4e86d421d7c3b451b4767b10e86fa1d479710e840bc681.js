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
const requireRole_1 = require("../auth/requireRole");
const roles_1 = require("../types/roles");
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
router.use((0, requireRole_1.requireRole)(roles_1.Roles.CREATOR));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9wcm9kdWN0cy9wcm9kdWN0LnJvdXRlcy50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9wcm9kdWN0cy9wcm9kdWN0LnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFpQztBQUNqQyxpRUFBbUQ7QUFDbkQsNkRBQXNEO0FBQ3RELHFEQUFrRDtBQUNsRCwwQ0FBdUM7QUFDdkMsMkRBQXVEO0FBQ3ZELHFEQU8wQjtBQUUxQixNQUFNLE1BQU0sR0FBVyxJQUFBLGdCQUFNLEdBQUUsQ0FBQztBQUVoQzs7eURBRXlEO0FBRXpELE1BQU0sQ0FBQyxHQUFHLENBQ1IsbUJBQW1CLEVBQ25CLFVBQVUsQ0FBQyxvQkFBb0IsQ0FDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxHQUFHLENBQ1IsOEJBQThCLEVBQzlCLFVBQVUsQ0FBQyx5QkFBeUIsQ0FDckMsQ0FBQztBQUVGOzt5REFFeUQ7QUFFekQsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBVyxDQUFDLENBQUM7QUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFFdkMsZ0JBQWdCO0FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQ1QsYUFBYSxFQUNiLElBQUEsNEJBQVksRUFBQyxxQ0FBb0IsQ0FBQyxFQUNsQyxVQUFVLENBQUMsY0FBYyxDQUMxQixDQUFDO0FBQ0YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRXJELGNBQWM7QUFDZCxNQUFNLENBQUMsSUFBSSxDQUNULEdBQUcsRUFDSCxJQUFBLDRCQUFZLEVBQUMsb0NBQW1CLENBQUMsRUFDakMsVUFBVSxDQUFDLGFBQWEsQ0FDekIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUMzQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRCxNQUFNLENBQUMsS0FBSyxDQUNWLE1BQU0sRUFDTixJQUFBLDRCQUFZLEVBQUMsb0NBQW1CLENBQUMsRUFDakMsVUFBVSxDQUFDLGFBQWEsQ0FDekIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVoRCxjQUFjO0FBQ2QsTUFBTSxDQUFDLElBQUksQ0FDVCxlQUFlLEVBQ2YsSUFBQSw0QkFBWSxFQUFDLG9DQUFtQixDQUFDLEVBQ2pDLFVBQVUsQ0FBQyxVQUFVLENBQ3RCLENBQUM7QUFDRixNQUFNLENBQUMsS0FBSyxDQUNWLDBCQUEwQixFQUMxQixJQUFBLDRCQUFZLEVBQUMsb0NBQW1CLENBQUMsRUFDakMsVUFBVSxDQUFDLGFBQWEsQ0FDekIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXBFLFdBQVc7QUFDWCxNQUFNLENBQUMsSUFBSSxDQUNULFlBQVksRUFDWixJQUFBLDRCQUFZLEVBQUMsa0NBQWlCLENBQUMsRUFDL0IsVUFBVSxDQUFDLFFBQVEsQ0FDcEIsQ0FBQztBQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRTdELGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgKiBhcyBjb250cm9sbGVyIGZyb20gXCIuL3Byb2R1Y3QuY29udHJvbGxlclwiO1xuaW1wb3J0IHsgcmVxdWlyZUF1dGggfSBmcm9tIFwiLi4vYXV0aC9hdXRoLm1pZGRsZXdhcmVcIjtcbmltcG9ydCB7IHJlcXVpcmVSb2xlIH0gZnJvbSBcIi4uL2F1dGgvcmVxdWlyZVJvbGVcIjtcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSBcIi4uL3R5cGVzL3JvbGVzXCI7XG5pbXBvcnQgeyB2YWxpZGF0ZUJvZHkgfSBmcm9tIFwiLi4vc2hhcmVkL3ZhbGlkYXRlLWJvZHlcIjtcbmltcG9ydCB7XG4gIGNyZWF0ZVByb2R1Y3RTY2hlbWEsXG4gIHVwZGF0ZVByb2R1Y3RTY2hlbWEsXG4gIGNyZWF0ZUNhdGVnb3J5U2NoZW1hLFxuICBjcmVhdGVWYXJpYW50U2NoZW1hLFxuICB1cGRhdGVWYXJpYW50U2NoZW1hLFxuICBjcmVhdGVNZWRpYVNjaGVtYSxcbn0gZnJvbSBcIi4vcHJvZHVjdC5zY2hlbWFcIjtcblxuY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICBQVUJMSUMgUk9VVEVTICDinIUgTVVTVCBDT01FIEZJUlNUXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxucm91dGVyLmdldChcbiAgXCIvcHVibGljLzp1c2VybmFtZVwiLFxuICBjb250cm9sbGVyLmxpc3RQdWJsaXNoZWRCeVN0b3JlXG4pO1xuXG5yb3V0ZXIuZ2V0KFxuICBcIi9wdWJsaWMvOnVzZXJuYW1lLzpwcm9kdWN0SWRcIixcbiAgY29udHJvbGxlci5nZXRTaW5nbGVQdWJsaXNoZWRQcm9kdWN0XG4pO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIENSRUFUT1IgUk9VVEVTIChQcm90ZWN0ZWQpXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxucm91dGVyLnVzZShyZXF1aXJlQXV0aCk7XG5yb3V0ZXIudXNlKHJlcXVpcmVSb2xlKFJvbGVzLkNSRUFUT1IpKTtcblxuLyogQ2F0ZWdvcmllcyAqL1xucm91dGVyLnBvc3QoXG4gIFwiL2NhdGVnb3JpZXNcIixcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZUNhdGVnb3J5U2NoZW1hKSxcbiAgY29udHJvbGxlci5jcmVhdGVDYXRlZ29yeVxuKTtcbnJvdXRlci5nZXQoXCIvY2F0ZWdvcmllc1wiLCBjb250cm9sbGVyLmxpc3RDYXRlZ29yaWVzKTtcblxuLyogUHJvZHVjdHMgKi9cbnJvdXRlci5wb3N0KFxuICBcIi9cIixcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZVByb2R1Y3RTY2hlbWEpLFxuICBjb250cm9sbGVyLmNyZWF0ZVByb2R1Y3Rcbik7XG5yb3V0ZXIuZ2V0KFwiL1wiLCBjb250cm9sbGVyLmdldE93blByb2R1Y3RzKTtcbnJvdXRlci5nZXQoXCIvOmlkXCIsIGNvbnRyb2xsZXIuZ2V0U2luZ2xlUHJvZHVjdCk7XG5yb3V0ZXIucGF0Y2goXG4gIFwiLzppZFwiLFxuICB2YWxpZGF0ZUJvZHkodXBkYXRlUHJvZHVjdFNjaGVtYSksXG4gIGNvbnRyb2xsZXIudXBkYXRlUHJvZHVjdFxuKTtcbnJvdXRlci5kZWxldGUoXCIvOmlkXCIsIGNvbnRyb2xsZXIuZGVsZXRlUHJvZHVjdCk7XG5cbi8qIFZhcmlhbnRzICovXG5yb3V0ZXIucG9zdChcbiAgXCIvOmlkL3ZhcmlhbnRzXCIsXG4gIHZhbGlkYXRlQm9keShjcmVhdGVWYXJpYW50U2NoZW1hKSxcbiAgY29udHJvbGxlci5hZGRWYXJpYW50XG4pO1xucm91dGVyLnBhdGNoKFxuICBcIi86aWQvdmFyaWFudHMvOnZhcmlhbnRJZFwiLFxuICB2YWxpZGF0ZUJvZHkodXBkYXRlVmFyaWFudFNjaGVtYSksXG4gIGNvbnRyb2xsZXIudXBkYXRlVmFyaWFudFxuKTtcbnJvdXRlci5kZWxldGUoXCIvOmlkL3ZhcmlhbnRzLzp2YXJpYW50SWRcIiwgY29udHJvbGxlci5kZWxldGVWYXJpYW50KTtcblxuLyogTWVkaWEgKi9cbnJvdXRlci5wb3N0KFxuICBcIi86aWQvbWVkaWFcIixcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZU1lZGlhU2NoZW1hKSxcbiAgY29udHJvbGxlci5hZGRNZWRpYVxuKTtcbnJvdXRlci5kZWxldGUoXCIvOmlkL21lZGlhLzptZWRpYUlkXCIsIGNvbnRyb2xsZXIucmVtb3ZlTWVkaWEpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7Il19
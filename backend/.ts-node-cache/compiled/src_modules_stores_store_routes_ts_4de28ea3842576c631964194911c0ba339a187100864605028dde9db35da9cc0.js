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
const controller = __importStar(require("./store.controller"));
const store_schema_1 = require("./store.schema");
const auth_middleware_1 = require("../auth/auth.middleware");
const requireRole_1 = require("../auth/requireRole");
const roles_1 = require("../types/roles");
const validate_body_1 = require("../shared/validate-body");
const router = (0, express_1.Router)();
/* ======================================
   CREATOR ROUTES
====================================== */
router.post("/", auth_middleware_1.requireAuth, (0, requireRole_1.requireRole)(roles_1.Roles.CREATOR), (0, validate_body_1.validateBody)(store_schema_1.createStoreSchema), controller.createStore);
router.get("/me", auth_middleware_1.requireAuth, (0, requireRole_1.requireRole)(roles_1.Roles.CREATOR), controller.getOwnStore);
router.patch("/me", auth_middleware_1.requireAuth, (0, requireRole_1.requireRole)(roles_1.Roles.CREATOR), (0, validate_body_1.validateBody)(store_schema_1.updateStoreSchema), controller.updateOwnStore);
router.delete("/me", auth_middleware_1.requireAuth, (0, requireRole_1.requireRole)(roles_1.Roles.CREATOR), controller.deleteOwnStore);
/* ======================================
   PUBLIC ROUTES
====================================== */
router.get("/:username", controller.getPublicStore);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUucm91dGVzLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL3N0b3Jlcy9zdG9yZS5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBaUM7QUFDakMsK0RBQWlEO0FBRWpELGlEQUd3QjtBQUV4Qiw2REFBc0Q7QUFDdEQscURBQWtEO0FBR2xELDBDQUF1QztBQUN2QywyREFBdUQ7QUFHdkQsTUFBTSxNQUFNLEdBQVcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFaEM7O3lDQUV5QztBQUV6QyxNQUFNLENBQUMsSUFBSSxDQUNULEdBQUcsRUFDSCw2QkFBVyxFQUNYLElBQUEseUJBQVcsRUFBQyxhQUFLLENBQUMsT0FBTyxDQUFDLEVBQzFCLElBQUEsNEJBQVksRUFBQyxnQ0FBaUIsQ0FBQyxFQUMvQixVQUFVLENBQUMsV0FBVyxDQUN2QixDQUFDO0FBRUYsTUFBTSxDQUFDLEdBQUcsQ0FDUixLQUFLLEVBQ0wsNkJBQVcsRUFDWCxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLE9BQU8sQ0FBQyxFQUMxQixVQUFVLENBQUMsV0FBVyxDQUN2QixDQUFDO0FBRUYsTUFBTSxDQUFDLEtBQUssQ0FDVixLQUFLLEVBQ0wsNkJBQVcsRUFDWCxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLE9BQU8sQ0FBQyxFQUMxQixJQUFBLDRCQUFZLEVBQUMsZ0NBQWlCLENBQUMsRUFDL0IsVUFBVSxDQUFDLGNBQWMsQ0FDMUIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLENBQ1gsS0FBSyxFQUNMLDZCQUFXLEVBQ1gsSUFBQSx5QkFBVyxFQUFDLGFBQUssQ0FBQyxPQUFPLENBQUMsRUFDMUIsVUFBVSxDQUFDLGNBQWMsQ0FDMUIsQ0FBQztBQUVGOzt5Q0FFeUM7QUFFekMsTUFBTSxDQUFDLEdBQUcsQ0FDUixZQUFZLEVBQ1osVUFBVSxDQUFDLGNBQWMsQ0FDMUIsQ0FBQztBQUdGLGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgKiBhcyBjb250cm9sbGVyIGZyb20gXCIuL3N0b3JlLmNvbnRyb2xsZXJcIjtcblxuaW1wb3J0IHtcbiAgY3JlYXRlU3RvcmVTY2hlbWEsXG4gIHVwZGF0ZVN0b3JlU2NoZW1hLFxufSBmcm9tIFwiLi9zdG9yZS5zY2hlbWFcIjtcblxuaW1wb3J0IHsgcmVxdWlyZUF1dGggfSBmcm9tIFwiLi4vYXV0aC9hdXRoLm1pZGRsZXdhcmVcIjtcbmltcG9ydCB7IHJlcXVpcmVSb2xlIH0gZnJvbSBcIi4uL2F1dGgvcmVxdWlyZVJvbGVcIjtcblxuXG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gXCIuLi90eXBlcy9yb2xlc1wiO1xuaW1wb3J0IHsgdmFsaWRhdGVCb2R5IH0gZnJvbSBcIi4uL3NoYXJlZC92YWxpZGF0ZS1ib2R5XCI7XG5cblxuY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIENSRUFUT1IgUk9VVEVTXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5yb3V0ZXIucG9zdChcbiAgXCIvXCIsXG4gIHJlcXVpcmVBdXRoLFxuICByZXF1aXJlUm9sZShSb2xlcy5DUkVBVE9SKSxcbiAgdmFsaWRhdGVCb2R5KGNyZWF0ZVN0b3JlU2NoZW1hKSxcbiAgY29udHJvbGxlci5jcmVhdGVTdG9yZVxuKTtcblxucm91dGVyLmdldChcbiAgXCIvbWVcIixcbiAgcmVxdWlyZUF1dGgsXG4gIHJlcXVpcmVSb2xlKFJvbGVzLkNSRUFUT1IpLFxuICBjb250cm9sbGVyLmdldE93blN0b3JlXG4pO1xuXG5yb3V0ZXIucGF0Y2goXG4gIFwiL21lXCIsXG4gIHJlcXVpcmVBdXRoLFxuICByZXF1aXJlUm9sZShSb2xlcy5DUkVBVE9SKSxcbiAgdmFsaWRhdGVCb2R5KHVwZGF0ZVN0b3JlU2NoZW1hKSxcbiAgY29udHJvbGxlci51cGRhdGVPd25TdG9yZVxuKTtcblxucm91dGVyLmRlbGV0ZShcbiAgXCIvbWVcIixcbiAgcmVxdWlyZUF1dGgsXG4gIHJlcXVpcmVSb2xlKFJvbGVzLkNSRUFUT1IpLFxuICBjb250cm9sbGVyLmRlbGV0ZU93blN0b3JlXG4pO1xuXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgUFVCTElDIFJPVVRFU1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxucm91dGVyLmdldChcbiAgXCIvOnVzZXJuYW1lXCIsXG4gIGNvbnRyb2xsZXIuZ2V0UHVibGljU3RvcmVcbik7XG5cblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xuIl19
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
const validate_body_1 = require("../shared/validate-body");
const store_schema_1 = require("./store.schema");
const auth_middleware_1 = require("../auth/auth.middleware");
const requireRole_1 = require("../auth/requireRole");
const roles_1 = require("../types/roles");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, requireRole_1.requireRole)(roles_1.Roles.ADMIN));
// GET /v1/api/admin/stores
router.get("/stores", controller.adminListStores);
// GET /v1/api/admin/stores/:id
router.get("/stores/:id", controller.adminGetStoreById);
// PATCH /v1/api/admin/stores/:id/suspend
router.patch("/stores/:id/suspend", (0, validate_body_1.validateBody)(store_schema_1.suspendStoreSchema), controller.adminSuspendStore);
// PATCH /v1/api/admin/stores/:id/unsuspend
router.patch("/stores/:id/unsuspend", controller.adminUnsuspendStore);
// PATCH /v1/api/admin/stores/:id/restore
router.patch("/stores/:id/restore", controller.adminRestoreStore);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUuYWRtaW4ucm91dGVzLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL3N0b3Jlcy9zdG9yZS5hZG1pbi5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBaUM7QUFDakMsK0RBQWlEO0FBQ2pELDJEQUF1RDtBQUN2RCxpREFBb0Q7QUFDcEQsNkRBQXNEO0FBQ3RELHFEQUFrRDtBQUNsRCwwQ0FBdUM7QUFFdkMsTUFBTSxNQUFNLEdBQVcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBVyxFQUFFLElBQUEseUJBQVcsRUFBQyxhQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUVsRCwyQkFBMkI7QUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRWxELCtCQUErQjtBQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUV4RCx5Q0FBeUM7QUFDekMsTUFBTSxDQUFDLEtBQUssQ0FDVixxQkFBcUIsRUFDckIsSUFBQSw0QkFBWSxFQUFDLGlDQUFrQixDQUFDLEVBQ2hDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FDN0IsQ0FBQztBQUVGLDJDQUEyQztBQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRXRFLHlDQUF5QztBQUN6QyxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRWxFLGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgKiBhcyBjb250cm9sbGVyIGZyb20gXCIuL3N0b3JlLmNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IHZhbGlkYXRlQm9keSB9IGZyb20gXCIuLi9zaGFyZWQvdmFsaWRhdGUtYm9keVwiO1xuaW1wb3J0IHsgc3VzcGVuZFN0b3JlU2NoZW1hIH0gZnJvbSBcIi4vc3RvcmUuc2NoZW1hXCI7XG5pbXBvcnQgeyByZXF1aXJlQXV0aCB9IGZyb20gXCIuLi9hdXRoL2F1dGgubWlkZGxld2FyZVwiO1xuaW1wb3J0IHsgcmVxdWlyZVJvbGUgfSBmcm9tIFwiLi4vYXV0aC9yZXF1aXJlUm9sZVwiO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tIFwiLi4vdHlwZXMvcm9sZXNcIjtcblxuY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcblxucm91dGVyLnVzZShyZXF1aXJlQXV0aCwgcmVxdWlyZVJvbGUoUm9sZXMuQURNSU4pKTtcblxuLy8gR0VUIC92MS9hcGkvYWRtaW4vc3RvcmVzXG5yb3V0ZXIuZ2V0KFwiL3N0b3Jlc1wiLCBjb250cm9sbGVyLmFkbWluTGlzdFN0b3Jlcyk7XG5cbi8vIEdFVCAvdjEvYXBpL2FkbWluL3N0b3Jlcy86aWRcbnJvdXRlci5nZXQoXCIvc3RvcmVzLzppZFwiLCBjb250cm9sbGVyLmFkbWluR2V0U3RvcmVCeUlkKTtcblxuLy8gUEFUQ0ggL3YxL2FwaS9hZG1pbi9zdG9yZXMvOmlkL3N1c3BlbmRcbnJvdXRlci5wYXRjaChcbiAgXCIvc3RvcmVzLzppZC9zdXNwZW5kXCIsXG4gIHZhbGlkYXRlQm9keShzdXNwZW5kU3RvcmVTY2hlbWEpLFxuICBjb250cm9sbGVyLmFkbWluU3VzcGVuZFN0b3JlXG4pO1xuXG4vLyBQQVRDSCAvdjEvYXBpL2FkbWluL3N0b3Jlcy86aWQvdW5zdXNwZW5kXG5yb3V0ZXIucGF0Y2goXCIvc3RvcmVzLzppZC91bnN1c3BlbmRcIiwgY29udHJvbGxlci5hZG1pblVuc3VzcGVuZFN0b3JlKTtcblxuLy8gUEFUQ0ggL3YxL2FwaS9hZG1pbi9zdG9yZXMvOmlkL3Jlc3RvcmVcbnJvdXRlci5wYXRjaChcIi9zdG9yZXMvOmlkL3Jlc3RvcmVcIiwgY29udHJvbGxlci5hZG1pblJlc3RvcmVTdG9yZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcbiJdfQ==
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
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUuYWRtaW4ucm91dGVzLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL3N0b3Jlcy9zdG9yZS5hZG1pbi5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBaUM7QUFDakMsK0RBQWlEO0FBQ2pELDJEQUF1RDtBQUN2RCxpREFBb0Q7QUFDcEQsNkRBQW9FO0FBRXBFLE1BQU0sTUFBTSxHQUFXLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQVcsRUFBRSw4QkFBWSxDQUFDLENBQUM7QUFFdEMsMkJBQTJCO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUVsRCwrQkFBK0I7QUFDL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFeEQseUNBQXlDO0FBQ3pDLE1BQU0sQ0FBQyxLQUFLLENBQ1YscUJBQXFCLEVBQ3JCLElBQUEsNEJBQVksRUFBQyxpQ0FBa0IsQ0FBQyxFQUNoQyxVQUFVLENBQUMsaUJBQWlCLENBQzdCLENBQUM7QUFFRiwyQ0FBMkM7QUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUV0RSx5Q0FBeUM7QUFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUVsRSxrQkFBZSxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0ICogYXMgY29udHJvbGxlciBmcm9tIFwiLi9zdG9yZS5jb250cm9sbGVyXCI7XG5pbXBvcnQgeyB2YWxpZGF0ZUJvZHkgfSBmcm9tIFwiLi4vc2hhcmVkL3ZhbGlkYXRlLWJvZHlcIjtcbmltcG9ydCB7IHN1c3BlbmRTdG9yZVNjaGVtYSB9IGZyb20gXCIuL3N0b3JlLnNjaGVtYVwiO1xuaW1wb3J0IHsgcmVxdWlyZUF1dGgsIHJlcXVpcmVBZG1pbiB9IGZyb20gXCIuLi9hdXRoL2F1dGgubWlkZGxld2FyZVwiO1xuXG5jb25zdCByb3V0ZXI6IFJvdXRlciA9IFJvdXRlcigpO1xuXG5yb3V0ZXIudXNlKHJlcXVpcmVBdXRoLCByZXF1aXJlQWRtaW4pO1xuXG4vLyBHRVQgL3YxL2FwaS9hZG1pbi9zdG9yZXNcbnJvdXRlci5nZXQoXCIvc3RvcmVzXCIsIGNvbnRyb2xsZXIuYWRtaW5MaXN0U3RvcmVzKTtcblxuLy8gR0VUIC92MS9hcGkvYWRtaW4vc3RvcmVzLzppZFxucm91dGVyLmdldChcIi9zdG9yZXMvOmlkXCIsIGNvbnRyb2xsZXIuYWRtaW5HZXRTdG9yZUJ5SWQpO1xuXG4vLyBQQVRDSCAvdjEvYXBpL2FkbWluL3N0b3Jlcy86aWQvc3VzcGVuZFxucm91dGVyLnBhdGNoKFxuICBcIi9zdG9yZXMvOmlkL3N1c3BlbmRcIixcbiAgdmFsaWRhdGVCb2R5KHN1c3BlbmRTdG9yZVNjaGVtYSksXG4gIGNvbnRyb2xsZXIuYWRtaW5TdXNwZW5kU3RvcmVcbik7XG5cbi8vIFBBVENIIC92MS9hcGkvYWRtaW4vc3RvcmVzLzppZC91bnN1c3BlbmRcbnJvdXRlci5wYXRjaChcIi9zdG9yZXMvOmlkL3Vuc3VzcGVuZFwiLCBjb250cm9sbGVyLmFkbWluVW5zdXNwZW5kU3RvcmUpO1xuXG4vLyBQQVRDSCAvdjEvYXBpL2FkbWluL3N0b3Jlcy86aWQvcmVzdG9yZVxucm91dGVyLnBhdGNoKFwiL3N0b3Jlcy86aWQvcmVzdG9yZVwiLCBjb250cm9sbGVyLmFkbWluUmVzdG9yZVN0b3JlKTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xuIl19
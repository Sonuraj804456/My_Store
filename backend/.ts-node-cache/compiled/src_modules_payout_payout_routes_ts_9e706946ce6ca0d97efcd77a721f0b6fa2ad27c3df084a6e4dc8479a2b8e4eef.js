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
const payoutController = __importStar(require("./payout.controller"));
const auth_middleware_1 = require("../auth/auth.middleware");
const requireRole_1 = require("../auth/requireRole");
const roles_1 = require("../types/roles");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
router.get("/payouts", (0, requireRole_1.requireRole)(roles_1.Roles.CREATOR), payoutController.listPayouts);
router.get("/payouts/summary", (0, requireRole_1.requireRole)(roles_1.Roles.CREATOR), payoutController.getSummary);
router.get("/admin/payouts", (0, requireRole_1.requireRole)(roles_1.Roles.ADMIN), payoutController.adminListPayouts);
router.patch("/admin/payouts/:id/release", (0, requireRole_1.requireRole)(roles_1.Roles.ADMIN), payoutController.adminReleasePayout);
router.patch("/admin/payouts/:id/cancel", (0, requireRole_1.requireRole)(roles_1.Roles.ADMIN), payoutController.adminCancelPayout);
router.patch("/admin/payouts/:id/freeze", (0, requireRole_1.requireRole)(roles_1.Roles.ADMIN), payoutController.adminFreezePayout);
router.patch("/admin/payouts/:id/unfreeze", (0, requireRole_1.requireRole)(roles_1.Roles.ADMIN), payoutController.adminUnfreezePayout);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9wYXlvdXQvcGF5b3V0LnJvdXRlcy50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9wYXlvdXQvcGF5b3V0LnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFpQztBQUNqQyxzRUFBd0Q7QUFDeEQsNkRBQXNEO0FBQ3RELHFEQUFrRDtBQUNsRCwwQ0FBdUM7QUFFdkMsTUFBTSxNQUFNLEdBQVcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBVyxDQUFDLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsSUFBQSx5QkFBVyxFQUFDLGFBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqRixNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUEseUJBQVcsRUFBQyxhQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFeEYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUYsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUcsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEcsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDeEcsTUFBTSxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxJQUFBLHlCQUFXLEVBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFNUcsa0JBQWUsTUFBTSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCAqIGFzIHBheW91dENvbnRyb2xsZXIgZnJvbSBcIi4vcGF5b3V0LmNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IHJlcXVpcmVBdXRoIH0gZnJvbSBcIi4uL2F1dGgvYXV0aC5taWRkbGV3YXJlXCI7XG5pbXBvcnQgeyByZXF1aXJlUm9sZSB9IGZyb20gXCIuLi9hdXRoL3JlcXVpcmVSb2xlXCI7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gXCIuLi90eXBlcy9yb2xlc1wiO1xuXG5jb25zdCByb3V0ZXI6IFJvdXRlciA9IFJvdXRlcigpO1xuXG5yb3V0ZXIudXNlKHJlcXVpcmVBdXRoKTtcblxucm91dGVyLmdldChcIi9wYXlvdXRzXCIsIHJlcXVpcmVSb2xlKFJvbGVzLkNSRUFUT1IpLCBwYXlvdXRDb250cm9sbGVyLmxpc3RQYXlvdXRzKTtcbnJvdXRlci5nZXQoXCIvcGF5b3V0cy9zdW1tYXJ5XCIsIHJlcXVpcmVSb2xlKFJvbGVzLkNSRUFUT1IpLCBwYXlvdXRDb250cm9sbGVyLmdldFN1bW1hcnkpO1xuXG5yb3V0ZXIuZ2V0KFwiL2FkbWluL3BheW91dHNcIiwgcmVxdWlyZVJvbGUoUm9sZXMuQURNSU4pLCBwYXlvdXRDb250cm9sbGVyLmFkbWluTGlzdFBheW91dHMpO1xucm91dGVyLnBhdGNoKFwiL2FkbWluL3BheW91dHMvOmlkL3JlbGVhc2VcIiwgcmVxdWlyZVJvbGUoUm9sZXMuQURNSU4pLCBwYXlvdXRDb250cm9sbGVyLmFkbWluUmVsZWFzZVBheW91dCk7XG5yb3V0ZXIucGF0Y2goXCIvYWRtaW4vcGF5b3V0cy86aWQvY2FuY2VsXCIsIHJlcXVpcmVSb2xlKFJvbGVzLkFETUlOKSwgcGF5b3V0Q29udHJvbGxlci5hZG1pbkNhbmNlbFBheW91dCk7XG5yb3V0ZXIucGF0Y2goXCIvYWRtaW4vcGF5b3V0cy86aWQvZnJlZXplXCIsIHJlcXVpcmVSb2xlKFJvbGVzLkFETUlOKSwgcGF5b3V0Q29udHJvbGxlci5hZG1pbkZyZWV6ZVBheW91dCk7XG5yb3V0ZXIucGF0Y2goXCIvYWRtaW4vcGF5b3V0cy86aWQvdW5mcmVlemVcIiwgcmVxdWlyZVJvbGUoUm9sZXMuQURNSU4pLCBwYXlvdXRDb250cm9sbGVyLmFkbWluVW5mcmVlemVQYXlvdXQpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XG4iXX0=
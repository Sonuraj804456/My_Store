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
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
router.get("/payouts", auth_middleware_1.requireMerchant, payoutController.listPayouts);
router.get("/payouts/summary", auth_middleware_1.requireMerchant, payoutController.getSummary);
router.get("/admin/payouts", auth_middleware_1.requireAdmin, payoutController.adminListPayouts);
router.patch("/admin/payouts/:id/release", auth_middleware_1.requireAdmin, payoutController.adminReleasePayout);
router.patch("/admin/payouts/:id/cancel", auth_middleware_1.requireAdmin, payoutController.adminCancelPayout);
router.patch("/admin/payouts/:id/freeze", auth_middleware_1.requireAdmin, payoutController.adminFreezePayout);
router.patch("/admin/payouts/:id/unfreeze", auth_middleware_1.requireAdmin, payoutController.adminUnfreezePayout);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9wYXlvdXQvcGF5b3V0LnJvdXRlcy50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9wYXlvdXQvcGF5b3V0LnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFpQztBQUNqQyxzRUFBd0Q7QUFDeEQsNkRBQXFGO0FBRXJGLE1BQU0sTUFBTSxHQUFXLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQVcsQ0FBQyxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGlDQUFlLEVBQUUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxpQ0FBZSxFQUFFLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTdFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsOEJBQVksRUFBRSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlFLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsOEJBQVksRUFBRSxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzlGLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsOEJBQVksRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsOEJBQVksRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsOEJBQVksRUFBRSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRWhHLGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgKiBhcyBwYXlvdXRDb250cm9sbGVyIGZyb20gXCIuL3BheW91dC5jb250cm9sbGVyXCI7XG5pbXBvcnQgeyByZXF1aXJlQXV0aCwgcmVxdWlyZU1lcmNoYW50LCByZXF1aXJlQWRtaW4gfSBmcm9tIFwiLi4vYXV0aC9hdXRoLm1pZGRsZXdhcmVcIjtcblxuY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcblxucm91dGVyLnVzZShyZXF1aXJlQXV0aCk7XG5cbnJvdXRlci5nZXQoXCIvcGF5b3V0c1wiLCByZXF1aXJlTWVyY2hhbnQsIHBheW91dENvbnRyb2xsZXIubGlzdFBheW91dHMpO1xucm91dGVyLmdldChcIi9wYXlvdXRzL3N1bW1hcnlcIiwgcmVxdWlyZU1lcmNoYW50LCBwYXlvdXRDb250cm9sbGVyLmdldFN1bW1hcnkpO1xuXG5yb3V0ZXIuZ2V0KFwiL2FkbWluL3BheW91dHNcIiwgcmVxdWlyZUFkbWluLCBwYXlvdXRDb250cm9sbGVyLmFkbWluTGlzdFBheW91dHMpO1xucm91dGVyLnBhdGNoKFwiL2FkbWluL3BheW91dHMvOmlkL3JlbGVhc2VcIiwgcmVxdWlyZUFkbWluLCBwYXlvdXRDb250cm9sbGVyLmFkbWluUmVsZWFzZVBheW91dCk7XG5yb3V0ZXIucGF0Y2goXCIvYWRtaW4vcGF5b3V0cy86aWQvY2FuY2VsXCIsIHJlcXVpcmVBZG1pbiwgcGF5b3V0Q29udHJvbGxlci5hZG1pbkNhbmNlbFBheW91dCk7XG5yb3V0ZXIucGF0Y2goXCIvYWRtaW4vcGF5b3V0cy86aWQvZnJlZXplXCIsIHJlcXVpcmVBZG1pbiwgcGF5b3V0Q29udHJvbGxlci5hZG1pbkZyZWV6ZVBheW91dCk7XG5yb3V0ZXIucGF0Y2goXCIvYWRtaW4vcGF5b3V0cy86aWQvdW5mcmVlemVcIiwgcmVxdWlyZUFkbWluLCBwYXlvdXRDb250cm9sbGVyLmFkbWluVW5mcmVlemVQYXlvdXQpO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XG4iXX0=
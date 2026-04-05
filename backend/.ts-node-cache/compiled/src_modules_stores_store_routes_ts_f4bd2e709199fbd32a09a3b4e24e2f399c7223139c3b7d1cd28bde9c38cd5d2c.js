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
const validate_body_1 = require("../shared/validate-body");
const router = (0, express_1.Router)();
/* ======================================
   MERCHANT ROUTES (store owners)
====================================== */
router.post("/", auth_middleware_1.requireAuth, auth_middleware_1.requireMerchant, (0, validate_body_1.validateBody)(store_schema_1.createStoreSchema), controller.createStore);
router.get("/me", auth_middleware_1.requireAuth, auth_middleware_1.requireMerchant, controller.getOwnStore);
router.patch("/me", auth_middleware_1.requireAuth, auth_middleware_1.requireMerchant, (0, validate_body_1.validateBody)(store_schema_1.updateStoreSchema), controller.updateOwnStore);
router.delete("/me", auth_middleware_1.requireAuth, auth_middleware_1.requireMerchant, controller.deleteOwnStore);
/* ======================================
   PUBLIC ROUTES
====================================== */
router.get("/:username", controller.getPublicStore);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9zdG9yZXMvc3RvcmUucm91dGVzLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9tb2R1bGVzL3N0b3Jlcy9zdG9yZS5yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBaUM7QUFDakMsK0RBQWlEO0FBRWpELGlEQUd3QjtBQUV4Qiw2REFBdUU7QUFDdkUsMkRBQXVEO0FBR3ZELE1BQU0sTUFBTSxHQUFXLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRWhDOzt5Q0FFeUM7QUFFekMsTUFBTSxDQUFDLElBQUksQ0FDVCxHQUFHLEVBQ0gsNkJBQVcsRUFDWCxpQ0FBZSxFQUNmLElBQUEsNEJBQVksRUFBQyxnQ0FBaUIsQ0FBQyxFQUMvQixVQUFVLENBQUMsV0FBVyxDQUN2QixDQUFDO0FBRUYsTUFBTSxDQUFDLEdBQUcsQ0FDUixLQUFLLEVBQ0wsNkJBQVcsRUFDWCxpQ0FBZSxFQUNmLFVBQVUsQ0FBQyxXQUFXLENBQ3ZCLENBQUM7QUFFRixNQUFNLENBQUMsS0FBSyxDQUNWLEtBQUssRUFDTCw2QkFBVyxFQUNYLGlDQUFlLEVBQ2YsSUFBQSw0QkFBWSxFQUFDLGdDQUFpQixDQUFDLEVBQy9CLFVBQVUsQ0FBQyxjQUFjLENBQzFCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxDQUNYLEtBQUssRUFDTCw2QkFBVyxFQUNYLGlDQUFlLEVBQ2YsVUFBVSxDQUFDLGNBQWMsQ0FDMUIsQ0FBQztBQUVGOzt5Q0FFeUM7QUFFekMsTUFBTSxDQUFDLEdBQUcsQ0FDUixZQUFZLEVBQ1osVUFBVSxDQUFDLGNBQWMsQ0FDMUIsQ0FBQztBQUdGLGtCQUFlLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgKiBhcyBjb250cm9sbGVyIGZyb20gXCIuL3N0b3JlLmNvbnRyb2xsZXJcIjtcblxuaW1wb3J0IHtcbiAgY3JlYXRlU3RvcmVTY2hlbWEsXG4gIHVwZGF0ZVN0b3JlU2NoZW1hLFxufSBmcm9tIFwiLi9zdG9yZS5zY2hlbWFcIjtcblxuaW1wb3J0IHsgcmVxdWlyZUF1dGgsIHJlcXVpcmVNZXJjaGFudCB9IGZyb20gXCIuLi9hdXRoL2F1dGgubWlkZGxld2FyZVwiO1xuaW1wb3J0IHsgdmFsaWRhdGVCb2R5IH0gZnJvbSBcIi4uL3NoYXJlZC92YWxpZGF0ZS1ib2R5XCI7XG5cblxuY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIE1FUkNIQU5UIFJPVVRFUyAoc3RvcmUgb3duZXJzKVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxucm91dGVyLnBvc3QoXG4gIFwiL1wiLFxuICByZXF1aXJlQXV0aCxcbiAgcmVxdWlyZU1lcmNoYW50LFxuICB2YWxpZGF0ZUJvZHkoY3JlYXRlU3RvcmVTY2hlbWEpLFxuICBjb250cm9sbGVyLmNyZWF0ZVN0b3JlXG4pO1xuXG5yb3V0ZXIuZ2V0KFxuICBcIi9tZVwiLFxuICByZXF1aXJlQXV0aCxcbiAgcmVxdWlyZU1lcmNoYW50LFxuICBjb250cm9sbGVyLmdldE93blN0b3JlXG4pO1xuXG5yb3V0ZXIucGF0Y2goXG4gIFwiL21lXCIsXG4gIHJlcXVpcmVBdXRoLFxuICByZXF1aXJlTWVyY2hhbnQsXG4gIHZhbGlkYXRlQm9keSh1cGRhdGVTdG9yZVNjaGVtYSksXG4gIGNvbnRyb2xsZXIudXBkYXRlT3duU3RvcmVcbik7XG5cbnJvdXRlci5kZWxldGUoXG4gIFwiL21lXCIsXG4gIHJlcXVpcmVBdXRoLFxuICByZXF1aXJlTWVyY2hhbnQsXG4gIGNvbnRyb2xsZXIuZGVsZXRlT3duU3RvcmVcbik7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICBQVUJMSUMgUk9VVEVTXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5yb3V0ZXIuZ2V0KFxuICBcIi86dXNlcm5hbWVcIixcbiAgY29udHJvbGxlci5nZXRQdWJsaWNTdG9yZVxuKTtcblxuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XG4iXX0=
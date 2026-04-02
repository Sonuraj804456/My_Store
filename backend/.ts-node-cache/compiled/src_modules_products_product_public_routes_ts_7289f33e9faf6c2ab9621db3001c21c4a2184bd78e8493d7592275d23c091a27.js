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
const router = (0, express_1.Router)();
router.get("/stores/:username/products", controller.listPublishedByStore);
router.get("/stores/:username/products/:productId", controller.getSinglePublishedProduct);
exports.default = router;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9wcm9kdWN0cy9wcm9kdWN0LnB1YmxpYy5yb3V0ZXMudHMiLCJzb3VyY2VzIjpbIi9hcHAvc3JjL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdC5wdWJsaWMucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQWlDO0FBQ2pDLGlFQUFtRDtBQUVuRCxNQUFNLE1BQU0sR0FBVyxJQUFBLGdCQUFNLEdBQUUsQ0FBQztBQUVoQyxNQUFNLENBQUMsR0FBRyxDQUNSLDRCQUE0QixFQUM1QixVQUFVLENBQUMsb0JBQW9CLENBQ2hDLENBQUM7QUFFRixNQUFNLENBQUMsR0FBRyxDQUNSLHVDQUF1QyxFQUN2QyxVQUFVLENBQUMseUJBQXlCLENBQ3JDLENBQUM7QUFFRixrQkFBZSxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0ICogYXMgY29udHJvbGxlciBmcm9tIFwiLi9wcm9kdWN0LmNvbnRyb2xsZXJcIjtcblxuY29uc3Qgcm91dGVyOiBSb3V0ZXIgPSBSb3V0ZXIoKTtcblxucm91dGVyLmdldChcbiAgXCIvc3RvcmVzLzp1c2VybmFtZS9wcm9kdWN0c1wiLFxuICBjb250cm9sbGVyLmxpc3RQdWJsaXNoZWRCeVN0b3JlXG4pO1xuXG5yb3V0ZXIuZ2V0KFxuICBcIi9zdG9yZXMvOnVzZXJuYW1lL3Byb2R1Y3RzLzpwcm9kdWN0SWRcIixcbiAgY29udHJvbGxlci5nZXRTaW5nbGVQdWJsaXNoZWRQcm9kdWN0XG4pO1xuXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7Il19
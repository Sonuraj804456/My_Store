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
exports.db = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const env_1 = require("./env");
// schemas
const authSchema = __importStar(require("../modules/auth/auth.schema"));
const storeSchema = __importStar(require("../modules/stores/store.db"));
const productSchema = __importStar(require("../modules/products/product.db"));
const orderSchema = __importStar(require("../modules/orders/order.db")); // 👈 ADD THIS
const payoutSchema = __importStar(require("../modules/payout/payout.db"));
const downloadSchema = __importStar(require("../modules/download/download.db"));
const messageSchema = __importStar(require("../modules/messages/message.db"));
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
});
exports.db = (0, node_postgres_1.drizzle)(pool, {
    schema: {
        ...authSchema,
        ...storeSchema,
        ...productSchema,
        ...orderSchema, // 👈 ADD THIS
        ...payoutSchema,
        ...downloadSchema,
        ...messageSchema,
    },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvY29uZmlnL2RiLnRzIiwic291cmNlcyI6WyIvYXBwL3NyYy9jb25maWcvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQW9EO0FBQ3BELDJCQUEwQjtBQUMxQiwrQkFBNEI7QUFFNUIsVUFBVTtBQUNWLHdFQUEwRDtBQUMxRCx3RUFBMEQ7QUFDMUQsOEVBQWdFO0FBQ2hFLHdFQUEwRCxDQUFDLGNBQWM7QUFDekUsMEVBQTREO0FBQzVELGdGQUFrRTtBQUNsRSw4RUFBZ0U7QUFFaEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFJLENBQUM7SUFDcEIsZ0JBQWdCLEVBQUUsU0FBRyxDQUFDLFlBQVk7Q0FDbkMsQ0FBQyxDQUFDO0FBRVUsUUFBQSxFQUFFLEdBQUcsSUFBQSx1QkFBTyxFQUFDLElBQUksRUFBRTtJQUM5QixNQUFNLEVBQUU7UUFDTixHQUFHLFVBQVU7UUFDYixHQUFHLFdBQVc7UUFDZCxHQUFHLGFBQWE7UUFDaEIsR0FBRyxXQUFXLEVBQUUsY0FBYztRQUM5QixHQUFHLFlBQVk7UUFDZixHQUFHLGNBQWM7UUFDakIsR0FBRyxhQUFhO0tBQ2pCO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZHJpenpsZSB9IGZyb20gXCJkcml6emxlLW9ybS9ub2RlLXBvc3RncmVzXCI7XG5pbXBvcnQgeyBQb29sIH0gZnJvbSBcInBnXCI7XG5pbXBvcnQgeyBlbnYgfSBmcm9tIFwiLi9lbnZcIjtcblxuLy8gc2NoZW1hc1xuaW1wb3J0ICogYXMgYXV0aFNjaGVtYSBmcm9tIFwiLi4vbW9kdWxlcy9hdXRoL2F1dGguc2NoZW1hXCI7XG5pbXBvcnQgKiBhcyBzdG9yZVNjaGVtYSBmcm9tIFwiLi4vbW9kdWxlcy9zdG9yZXMvc3RvcmUuZGJcIjtcbmltcG9ydCAqIGFzIHByb2R1Y3RTY2hlbWEgZnJvbSBcIi4uL21vZHVsZXMvcHJvZHVjdHMvcHJvZHVjdC5kYlwiO1xuaW1wb3J0ICogYXMgb3JkZXJTY2hlbWEgZnJvbSBcIi4uL21vZHVsZXMvb3JkZXJzL29yZGVyLmRiXCI7IC8vIPCfkYggQUREIFRISVNcbmltcG9ydCAqIGFzIHBheW91dFNjaGVtYSBmcm9tIFwiLi4vbW9kdWxlcy9wYXlvdXQvcGF5b3V0LmRiXCI7XG5pbXBvcnQgKiBhcyBkb3dubG9hZFNjaGVtYSBmcm9tIFwiLi4vbW9kdWxlcy9kb3dubG9hZC9kb3dubG9hZC5kYlwiO1xuaW1wb3J0ICogYXMgbWVzc2FnZVNjaGVtYSBmcm9tIFwiLi4vbW9kdWxlcy9tZXNzYWdlcy9tZXNzYWdlLmRiXCI7XG5cbmNvbnN0IHBvb2wgPSBuZXcgUG9vbCh7XG4gIGNvbm5lY3Rpb25TdHJpbmc6IGVudi5EQVRBQkFTRV9VUkwsXG59KTtcblxuZXhwb3J0IGNvbnN0IGRiID0gZHJpenpsZShwb29sLCB7XG4gIHNjaGVtYToge1xuICAgIC4uLmF1dGhTY2hlbWEsXG4gICAgLi4uc3RvcmVTY2hlbWEsXG4gICAgLi4ucHJvZHVjdFNjaGVtYSxcbiAgICAuLi5vcmRlclNjaGVtYSwgLy8g8J+RiCBBREQgVEhJU1xuICAgIC4uLnBheW91dFNjaGVtYSxcbiAgICAuLi5kb3dubG9hZFNjaGVtYSxcbiAgICAuLi5tZXNzYWdlU2NoZW1hLFxuICB9LFxufSk7Il19
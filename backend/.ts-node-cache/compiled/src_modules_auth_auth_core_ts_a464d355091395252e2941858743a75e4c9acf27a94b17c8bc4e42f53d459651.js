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
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const drizzle_1 = require("better-auth/adapters/drizzle");
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const schema = __importStar(require("./auth.schema"));
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, drizzle_1.drizzleAdapter)(db_1.db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    // 🔐 COOKIE CONFIG (THIS WAS MISSING)
    cookies: {
        session: {
            name: "better-auth.session",
            options: {
                httpOnly: true,
                sameSite: "lax", // ✅ REQUIRED for localhost cross-port
                secure: false, // ✅ MUST be false on localhost
                path: "/",
            },
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
    },
    secret: env_1.env.BETTER_AUTH_SECRET,
    baseURL: env_1.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGguY29yZS50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGguY29yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBeUM7QUFDekMsMERBQThEO0FBQzlELHdDQUFxQztBQUNyQywwQ0FBdUM7QUFDdkMsc0RBQXdDO0FBRTNCLFFBQUEsSUFBSSxHQUFHLElBQUEsd0JBQVUsRUFBQztJQUM3QixRQUFRLEVBQUUsSUFBQSx3QkFBYyxFQUFDLE9BQUUsRUFBRTtRQUMzQixRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87WUFDdkIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3ZCLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtTQUNsQztLQUNGLENBQUM7SUFFRixnQkFBZ0IsRUFBRTtRQUNoQixPQUFPLEVBQUUsSUFBSTtLQUNkO0lBRUQsc0NBQXNDO0lBQ3RDLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxxQkFBcUI7WUFDM0IsT0FBTyxFQUFFO2dCQUNQLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFFBQVEsRUFBRSxLQUFLLEVBQUksc0NBQXNDO2dCQUN6RCxNQUFNLEVBQUUsS0FBSyxFQUFNLCtCQUErQjtnQkFDbEQsSUFBSSxFQUFFLEdBQUc7YUFDVjtTQUNGO0tBQ0Y7SUFFRCxPQUFPLEVBQUU7UUFDUCxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztLQUM1QjtJQUVELE1BQU0sRUFBRSxTQUFHLENBQUMsa0JBQWtCO0lBQzlCLE9BQU8sRUFBRSxTQUFHLENBQUMsZUFBZSxJQUFJLHVCQUF1QjtDQUN4RCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBiZXR0ZXJBdXRoIH0gZnJvbSBcImJldHRlci1hdXRoXCI7XG5pbXBvcnQgeyBkcml6emxlQWRhcHRlciB9IGZyb20gXCJiZXR0ZXItYXV0aC9hZGFwdGVycy9kcml6emxlXCI7XG5pbXBvcnQgeyBkYiB9IGZyb20gXCIuLi8uLi9jb25maWcvZGJcIjtcbmltcG9ydCB7IGVudiB9IGZyb20gXCIuLi8uLi9jb25maWcvZW52XCI7XG5pbXBvcnQgKiBhcyBzY2hlbWEgZnJvbSBcIi4vYXV0aC5zY2hlbWFcIjtcblxuZXhwb3J0IGNvbnN0IGF1dGggPSBiZXR0ZXJBdXRoKHtcbiAgZGF0YWJhc2U6IGRyaXp6bGVBZGFwdGVyKGRiLCB7XG4gICAgcHJvdmlkZXI6IFwicGdcIixcbiAgICBzY2hlbWE6IHtcbiAgICAgIHVzZXI6IHNjaGVtYS51c2VyLFxuICAgICAgc2Vzc2lvbjogc2NoZW1hLnNlc3Npb24sXG4gICAgICBhY2NvdW50OiBzY2hlbWEuYWNjb3VudCxcbiAgICAgIHZlcmlmaWNhdGlvbjogc2NoZW1hLnZlcmlmaWNhdGlvbixcbiAgICB9LFxuICB9KSxcblxuICBlbWFpbEFuZFBhc3N3b3JkOiB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgfSxcblxuICAvLyDwn5SQIENPT0tJRSBDT05GSUcgKFRISVMgV0FTIE1JU1NJTkcpXG4gIGNvb2tpZXM6IHtcbiAgICBzZXNzaW9uOiB7XG4gICAgICBuYW1lOiBcImJldHRlci1hdXRoLnNlc3Npb25cIixcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICAgIHNhbWVTaXRlOiBcImxheFwiLCAgIC8vIOKchSBSRVFVSVJFRCBmb3IgbG9jYWxob3N0IGNyb3NzLXBvcnRcbiAgICAgICAgc2VjdXJlOiBmYWxzZSwgICAgIC8vIOKchSBNVVNUIGJlIGZhbHNlIG9uIGxvY2FsaG9zdFxuICAgICAgICBwYXRoOiBcIi9cIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcblxuICBzZXNzaW9uOiB7XG4gICAgZXhwaXJlc0luOiA2MCAqIDYwICogMjQgKiA3LFxuICB9LFxuXG4gIHNlY3JldDogZW52LkJFVFRFUl9BVVRIX1NFQ1JFVCxcbiAgYmFzZVVSTDogZW52LkJFVFRFUl9BVVRIX1VSTCA/PyBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxufSk7XG4iXX0=
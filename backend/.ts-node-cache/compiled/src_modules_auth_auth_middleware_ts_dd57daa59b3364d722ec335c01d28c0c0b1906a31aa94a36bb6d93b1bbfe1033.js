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
exports.requireAuth = requireAuth;
exports.requireMerchant = requireMerchant;
exports.requireAdmin = requireAdmin;
const db_1 = require("../../config/db");
const auth_schema_1 = require("./auth.schema");
const drizzle_orm_1 = require("drizzle-orm");
const response_1 = require("../shared/response");
async function requireAuth(req, res, next) {
    const authHeader = typeof req.get === "function"
        ? req.get("authorization")
        : req.headers?.authorization;
    // If no Authorization header, try BetterAuth session (e.g., cookie/session)
    if (!authHeader) {
        try {
            const authModule = await Promise.resolve().then(() => __importStar(require("./auth.core")));
            const auth = authModule.auth;
            if (auth && auth.api && typeof auth.api.getSession === "function") {
                const betterSession = await auth.api.getSession(req).catch(() => null);
                if (betterSession && betterSession.user) {
                    req.user = {
                        id: betterSession.user.id,
                        email: betterSession.user.email,
                    };
                    return next();
                }
            }
        }
        catch (e) {
            // ignore import/mock errors and fall through to unauthorized
        }
        return res.status(401).json((0, response_1.failure)({ message: "Unauthorized" }));
    }
    const token = authHeader.replace("Bearer ", "");
    const sessionRecord = await db_1.db.query.session.findFirst({
        where: (0, drizzle_orm_1.eq)(auth_schema_1.session.token, token),
        with: { user: true },
    });
    if (!sessionRecord || sessionRecord.expiresAt < new Date()) {
        return res.status(401).json((0, response_1.failure)({ message: "Invalid or expired token" }));
    }
    // Attach user with identity info only
    req.user = {
        id: sessionRecord.user.id,
        email: sessionRecord.user.email,
    };
    next();
}
/**
 * Middleware to check if authenticated user is a merchant (store owner)
 */
async function requireMerchant(req, res, next) {
    if (!req.user) {
        return res.status(401).json((0, response_1.failure)({ message: "Unauthorized" }));
    }
    const merchant = await db_1.db.query.merchants.findFirst({
        where: (0, drizzle_orm_1.eq)(auth_schema_1.merchants.userId, req.user.id),
    });
    if (!merchant) {
        return res.status(403).json((0, response_1.failure)({ message: "User is not a merchant" }));
    }
    // Attach merchant info to request
    req.merchant = merchant;
    next();
}
/**
 * Middleware to check if authenticated user is an admin
 * Admins are controlled via ENV variable
 */
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json((0, response_1.failure)({ message: "Unauthorized" }));
    }
    const adminIds = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);
    if (!adminIds.includes(req.user.id)) {
        return res.status(403).json((0, response_1.failure)({ message: "Admin access required" }));
    }
    next();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGgubWlkZGxld2FyZS50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGgubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLGtDQWtEQztBQUtELDBDQW9CQztBQU1ELG9DQWdCQztBQXRHRCx3Q0FBcUM7QUFDckMsK0NBQW1EO0FBQ25ELDZDQUFpQztBQUNqQyxpREFBNkM7QUFFdEMsS0FBSyxVQUFVLFdBQVcsQ0FDL0IsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixNQUFNLFVBQVUsR0FDaEIsT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLFVBQVU7UUFDM0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztJQUU3Qiw0RUFBNEU7SUFDNUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQztZQUNILE1BQU0sVUFBVSxHQUFHLHdEQUFhLGFBQWEsR0FBQyxDQUFDO1lBQy9DLE1BQU0sSUFBSSxHQUFJLFVBQWtCLENBQUMsSUFBSSxDQUFDO1lBQ3RDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDbEUsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlFLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEMsR0FBRyxDQUFDLElBQUksR0FBRzt3QkFDVCxFQUFFLEVBQUUsYUFB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LGNBQWMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRS9FLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNwQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsa0JBQU8sRUFBQyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsSUFBSSxFQUFFLENBQUM7QUFDVCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmVxdWVzdCwgUmVzcG9uc2UsIE5leHRGdW5jdGlvbiB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBkYiB9IGZyb20gXCIuLi8uLi9jb25maWcvZGJcIjtcbmltcG9ydCB7IHNlc3Npb24sIG1lcmNoYW50cyB9IGZyb20gXCIuL2F1dGguc2NoZW1hXCI7XG5pbXBvcnQgeyBlcSB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgZmFpbHVyZSB9IGZyb20gXCIuLi9zaGFyZWQvcmVzcG9uc2VcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBdXRoKFxuICByZXE6IFJlcXVlc3QsXG4gIHJlczogUmVzcG9uc2UsXG4gIG5leHQ6IE5leHRGdW5jdGlvblxuKSB7XG4gIGNvbnN0IGF1dGhIZWFkZXIgPVxuICB0eXBlb2YgcmVxLmdldCA9PT0gXCJmdW5jdGlvblwiXG4gICAgPyByZXEuZ2V0KFwiYXV0aG9yaXphdGlvblwiKVxuICAgIDogcmVxLmhlYWRlcnM/LmF1dGhvcml6YXRpb247XG5cbiAgICAvLyBJZiBubyBBdXRob3JpemF0aW9uIGhlYWRlciwgdHJ5IEJldHRlckF1dGggc2Vzc2lvbiAoZS5nLiwgY29va2llL3Nlc3Npb24pXG4gICAgaWYgKCFhdXRoSGVhZGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBhdXRoTW9kdWxlID0gYXdhaXQgaW1wb3J0KFwiLi9hdXRoLmNvcmVcIik7XG4gICAgICAgIGNvbnN0IGF1dGggPSAoYXV0aE1vZHVsZSBhcyBhbnkpLmF1dGg7XG4gICAgICAgIGlmIChhdXRoICYmIGF1dGguYXBpICYmIHR5cGVvZiBhdXRoLmFwaS5nZXRTZXNzaW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb25zdCBiZXR0ZXJTZXNzaW9uID0gYXdhaXQgYXV0aC5hcGkuZ2V0U2Vzc2lvbihyZXEgYXMgYW55KS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgICAgICAgICBpZiAoYmV0dGVyU2Vzc2lvbiAmJiBiZXR0ZXJTZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgICAgIHJlcS51c2VyID0ge1xuICAgICAgICAgICAgICBpZDogYmV0dGVyU2Vzc2lvbi51c2VyLmlkLFxuICAgICAgICAgICAgICBlbWFpbDogYmV0dGVyU2Vzc2lvbi51c2VyLmVtYWlsLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlnbm9yZSBpbXBvcnQvbW9jayBlcnJvcnMgYW5kIGZhbGwgdGhyb3VnaCB0byB1bmF1dGhvcml6ZWRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKGZhaWx1cmUoeyBtZXNzYWdlOiBcIlVuYXV0aG9yaXplZFwiIH0pKTtcbiAgICB9XG5cbiAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyLnJlcGxhY2UoXCJCZWFyZXIgXCIsIFwiXCIpO1xuXG4gIGNvbnN0IHNlc3Npb25SZWNvcmQgPSBhd2FpdCBkYi5xdWVyeS5zZXNzaW9uLmZpbmRGaXJzdCh7XG4gICAgd2hlcmU6IGVxKHNlc3Npb24udG9rZW4sIHRva2VuKSxcbiAgICB3aXRoOiB7IHVzZXI6IHRydWUgfSxcbiAgfSk7XG5cbiAgaWYgKCFzZXNzaW9uUmVjb3JkIHx8IHNlc3Npb25SZWNvcmQuZXhwaXJlc0F0IDwgbmV3IERhdGUoKSkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbihmYWlsdXJlKHsgbWVzc2FnZTogXCJJbnZhbGlkIG9yIGV4cGlyZWQgdG9rZW5cIiB9KSk7XG4gIH1cblxuICAvLyBBdHRhY2ggdXNlciB3aXRoIGlkZW50aXR5IGluZm8gb25seVxuICByZXEudXNlciA9IHtcbiAgICBpZDogc2Vzc2lvblJlY29yZC51c2VyLmlkLFxuICAgIGVtYWlsOiBzZXNzaW9uUmVjb3JkLnVzZXIuZW1haWwsXG4gIH07XG5cbiAgbmV4dCgpO1xufVxuXG4vKipcbiAqIE1pZGRsZXdhcmUgdG8gY2hlY2sgaWYgYXV0aGVudGljYXRlZCB1c2VyIGlzIGEgbWVyY2hhbnQgKHN0b3JlIG93bmVyKVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZU1lcmNoYW50KFxuICByZXE6IFJlcXVlc3QsXG4gIHJlczogUmVzcG9uc2UsXG4gIG5leHQ6IE5leHRGdW5jdGlvblxuKSB7XG4gIGlmICghcmVxLnVzZXIpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oZmFpbHVyZSh7IG1lc3NhZ2U6IFwiVW5hdXRob3JpemVkXCIgfSkpO1xuICB9XG5cbiAgY29uc3QgbWVyY2hhbnQgPSBhd2FpdCBkYi5xdWVyeS5tZXJjaGFudHMuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogZXEobWVyY2hhbnRzLnVzZXJJZCwgcmVxLnVzZXIuaWQpLFxuICB9KTtcblxuICBpZiAoIW1lcmNoYW50KSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5qc29uKGZhaWx1cmUoeyBtZXNzYWdlOiBcIlVzZXIgaXMgbm90IGEgbWVyY2hhbnRcIiB9KSk7XG4gIH1cblxuICAvLyBBdHRhY2ggbWVyY2hhbnQgaW5mbyB0byByZXF1ZXN0XG4gIChyZXEgYXMgYW55KS5tZXJjaGFudCA9IG1lcmNoYW50O1xuICBuZXh0KCk7XG59XG5cbi8qKlxuICogTWlkZGxld2FyZSB0byBjaGVjayBpZiBhdXRoZW50aWNhdGVkIHVzZXIgaXMgYW4gYWRtaW5cbiAqIEFkbWlucyBhcmUgY29udHJvbGxlZCB2aWEgRU5WIHZhcmlhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlQWRtaW4oXG4gIHJlcTogUmVxdWVzdCxcbiAgcmVzOiBSZXNwb25zZSxcbiAgbmV4dDogTmV4dEZ1bmN0aW9uXG4pIHtcbiAgaWYgKCFyZXEudXNlcikge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbihmYWlsdXJlKHsgbWVzc2FnZTogXCJVbmF1dGhvcml6ZWRcIiB9KSk7XG4gIH1cblxuICBjb25zdCBhZG1pbklkcyA9IChwcm9jZXNzLmVudi5BRE1JTl9VU0VSX0lEUyB8fCBcIlwiKS5zcGxpdChcIixcIikuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGlmICghYWRtaW5JZHMuaW5jbHVkZXMocmVxLnVzZXIuaWQpKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAzKS5qc29uKGZhaWx1cmUoeyBtZXNzYWdlOiBcIkFkbWluIGFjY2VzcyByZXF1aXJlZFwiIH0pKTtcbiAgfVxuXG4gIG5leHQoKTtcbn1cbiJdfQ==
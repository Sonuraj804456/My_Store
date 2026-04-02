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
                        role: betterSession.user.role,
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
    // 🔑 IMPORTANT: attach ONLY what the app needs
    req.user = {
        id: sessionRecord.user.id, // must match stores.userId
        role: sessionRecord.user.role,
        email: sessionRecord.user.email,
    };
    next();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGgubWlkZGxld2FyZS50cyIsInNvdXJjZXMiOlsiL2FwcC9zcmMvbW9kdWxlcy9hdXRoL2F1dGgubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLGtDQW9EQztBQTNERCx3Q0FBcUM7QUFDckMsK0NBQXdDO0FBQ3hDLDZDQUFpQztBQUVqQyxpREFBNkM7QUFHdEMsS0FBSyxVQUFVLFdBQVcsQ0FDL0IsR0FBWSxFQUNaLEdBQWEsRUFDYixJQUFrQjtJQUVsQixNQUFNLFVBQVUsR0FDaEIsT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLFVBQVU7UUFDM0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQztJQUU3Qiw0RUFBNEU7SUFDNUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQztZQUNILE1BQU0sVUFBVSxHQUFHLHdEQUFhLGFBQWEsR0FBQyxDQUFDO1lBQy9DLE1BQU0sSUFBSSxHQUFJLFVBQWtCLENBQUMsSUFBSSxDQUFDO1lBQ3RDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDbEUsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlFLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDeEMsR0FBRyxDQUFDLElBQUksR0FBRzt3QkFDVCxFQUFFLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN6QixJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFhO3dCQUN0QyxLQUFLLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLO3FCQUNoQyxDQUFDO29CQUNGLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDWCw2REFBNkQ7UUFDL0QsQ0FBQztRQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxrQkFBTyxFQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUgsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFaEQsTUFBTSxhQUFhLEdBQUcsTUFBTSxPQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDckQsS0FBSyxFQUFFLElBQUEsZ0JBQUUsRUFBQyxxQkFBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDL0IsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtLQUNyQixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsYUFBYSxJQUFJLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDO1FBQzNELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxrQkFBTyxFQUFDLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7SUFFRCwrQ0FBK0M7SUFDL0MsR0FBRyxDQUFDLElBQUksR0FBRztRQUNULEVBQUUsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBUSwyQkFBMkI7UUFDNUQsSUFBSSxFQUFFLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBYTtRQUN0QyxLQUFLLEVBQUUsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLO0tBQ2hDLENBQUM7SUFFRixJQUFJLEVBQUUsQ0FBQztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IGRiIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9kYlwiO1xuaW1wb3J0IHsgc2Vzc2lvbiB9IGZyb20gXCIuL2F1dGguc2NoZW1hXCI7XG5pbXBvcnQgeyBlcSB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tIFwiLi4vdHlwZXMvcm9sZXNcIjtcbmltcG9ydCB7IGZhaWx1cmUgfSBmcm9tIFwiLi4vc2hhcmVkL3Jlc3BvbnNlXCI7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBdXRoKFxuICByZXE6IFJlcXVlc3QsXG4gIHJlczogUmVzcG9uc2UsXG4gIG5leHQ6IE5leHRGdW5jdGlvblxuKSB7XG4gIGNvbnN0IGF1dGhIZWFkZXIgPVxuICB0eXBlb2YgcmVxLmdldCA9PT0gXCJmdW5jdGlvblwiXG4gICAgPyByZXEuZ2V0KFwiYXV0aG9yaXphdGlvblwiKVxuICAgIDogcmVxLmhlYWRlcnM/LmF1dGhvcml6YXRpb247XG5cbiAgICAvLyBJZiBubyBBdXRob3JpemF0aW9uIGhlYWRlciwgdHJ5IEJldHRlckF1dGggc2Vzc2lvbiAoZS5nLiwgY29va2llL3Nlc3Npb24pXG4gICAgaWYgKCFhdXRoSGVhZGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBhdXRoTW9kdWxlID0gYXdhaXQgaW1wb3J0KFwiLi9hdXRoLmNvcmVcIik7XG4gICAgICAgIGNvbnN0IGF1dGggPSAoYXV0aE1vZHVsZSBhcyBhbnkpLmF1dGg7XG4gICAgICAgIGlmIChhdXRoICYmIGF1dGguYXBpICYmIHR5cGVvZiBhdXRoLmFwaS5nZXRTZXNzaW9uID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBjb25zdCBiZXR0ZXJTZXNzaW9uID0gYXdhaXQgYXV0aC5hcGkuZ2V0U2Vzc2lvbihyZXEgYXMgYW55KS5jYXRjaCgoKSA9PiBudWxsKTtcbiAgICAgICAgICBpZiAoYmV0dGVyU2Vzc2lvbiAmJiBiZXR0ZXJTZXNzaW9uLnVzZXIpIHtcbiAgICAgICAgICAgIHJlcS51c2VyID0ge1xuICAgICAgICAgICAgICBpZDogYmV0dGVyU2Vzc2lvbi51c2VyLmlkLFxuICAgICAgICAgICAgICByb2xlOiBiZXR0ZXJTZXNzaW9uLnVzZXIucm9sZSBhcyBSb2xlcyxcbiAgICAgICAgICAgICAgZW1haWw6IGJldHRlclNlc3Npb24udXNlci5lbWFpbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpZ25vcmUgaW1wb3J0L21vY2sgZXJyb3JzIGFuZCBmYWxsIHRocm91Z2ggdG8gdW5hdXRob3JpemVkXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbihmYWlsdXJlKHsgbWVzc2FnZTogXCJVbmF1dGhvcml6ZWRcIiB9KSk7XG4gICAgfVxuXG4gIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5yZXBsYWNlKFwiQmVhcmVyIFwiLCBcIlwiKTtcblxuICBjb25zdCBzZXNzaW9uUmVjb3JkID0gYXdhaXQgZGIucXVlcnkuc2Vzc2lvbi5maW5kRmlyc3Qoe1xuICAgIHdoZXJlOiBlcShzZXNzaW9uLnRva2VuLCB0b2tlbiksXG4gICAgd2l0aDogeyB1c2VyOiB0cnVlIH0sXG4gIH0pO1xuXG4gIGlmICghc2Vzc2lvblJlY29yZCB8fCBzZXNzaW9uUmVjb3JkLmV4cGlyZXNBdCA8IG5ldyBEYXRlKCkpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oZmFpbHVyZSh7IG1lc3NhZ2U6IFwiSW52YWxpZCBvciBleHBpcmVkIHRva2VuXCIgfSkpO1xuICB9XG5cbiAgLy8g8J+UkSBJTVBPUlRBTlQ6IGF0dGFjaCBPTkxZIHdoYXQgdGhlIGFwcCBuZWVkc1xuICByZXEudXNlciA9IHtcbiAgICBpZDogc2Vzc2lvblJlY29yZC51c2VyLmlkLCAgICAgICAvLyBtdXN0IG1hdGNoIHN0b3Jlcy51c2VySWRcbiAgICByb2xlOiBzZXNzaW9uUmVjb3JkLnVzZXIucm9sZSBhcyBSb2xlcyxcbiAgICBlbWFpbDogc2Vzc2lvblJlY29yZC51c2VyLmVtYWlsLFxuICB9O1xuXG4gIG5leHQoKTtcbn1cbiJdfQ==